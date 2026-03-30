import { ColumnSchema } from '@shared/types';
import { toCamelCase, dbTypeToJava, getJpaAnnotations } from '../utils/code-generator.utils';

/**
 * Java 代码生成器
 */
export class JavaCodeGenerator {
  /**
   * 生成实体类
   */
  static generateEntity(
    tableName: string,
    tableComment: string,
    columns: ColumnSchema[],
    packageName: string,
    className: string
  ): string {
    const imports = new Set<string>();
    imports.add('javax.persistence.*');
    imports.add('javax.persistence.GenerationType');
    imports.add('lombok.Data');
    imports.add('lombok.NoArgsConstructor');
    imports.add('lombok.AllArgsConstructor');

    const fields = columns.map((col) => {
      const javaType = dbTypeToJava(col.dataType);
      const annotations = getJpaAnnotations(col);
      const fieldName = toCamelCase(col.columnName);

      // 根据类型添加导入
      if (javaType === 'Date') {
        imports.add('java.util.Date');
      } else if (javaType === 'BigDecimal') {
        imports.add('java.math.BigDecimal');
      } else if (javaType === 'Boolean') {
        imports.add('java.lang.Boolean');
      }

      return `    ${annotations.join('\n    ')}
    private ${javaType} ${fieldName};`;
    });

    return `package ${packageName};

${Array.from(imports)
  .map((imp) => `import ${imp};`)
  .join('\n')}

/**
 * ${tableComment || tableName}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "${tableName}")
public class ${className} {

${fields.join('\n\n')}
}`;
  }

  /**
   * 生成 Mapper 接口
   */
  static generateMapper(
    entityPackage: string,
    entityClassName: string,
    packageName: string,
    className: string
  ): string {
    return `package ${packageName};

import ${entityPackage}.${entityClassName};
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * ${entityClassName} Mapper
 */
@Mapper
public interface ${className} {

    ${entityClassName} selectById(@Param("id") Long id);

    List<${entityClassName}> selectList(${entityClassName} ${toCamelCase(entityClassName.replace('Entity', ''))});

    int insert(${entityClassName} ${toCamelCase(entityClassName.replace('Entity', ''))});

    int updateById(${entityClassName} ${toCamelCase(entityClassName.replace('Entity', ''))});

    int deleteById(@Param("id") Long id);
}`;
  }

  /**
   * 生成 Mapper XML
   */
  static generateMapperXml(
    namespace: string,
    tableName: string,
    columns: ColumnSchema[],
    className: string
  ): string {
    const entityClassName = className.replace('Mapper', 'Entity');
    const baseResultMap = columns
      .map(
        (col) =>
          `        <result column="${col.columnName}" property="${toCamelCase(col.columnName)}" />`
      )
      .join('\n');

    const baseColumnList = columns.map((col) => `\`${col.columnName}\``).join(', ');

    const insertColumns = columns.map((col) => `\`${col.columnName}\``).join(', ');
    const insertValues = columns.map((col) => `#{${toCamelCase(col.columnName)}}`).join(', ');

    const updateSets = columns
      .filter((col) => !col.isPrimaryKey)
      .map((col) => `\`${col.columnName}\` = #{${toCamelCase(col.columnName)}}`)
      .join(',\n            ');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${namespace}">

    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="${entityClassName}">
${baseResultMap}
    </resultMap>

    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        ${baseColumnList}
    </sql>

    <!-- 根据ID查询 -->
    <select id="selectById" resultMap="BaseResultMap">
        SELECT 
        <include refid="Base_Column_List" />
        FROM ${tableName}
        WHERE id = #{id}
    </select>

    <!-- 查询列表 -->
    <select id="selectList" resultMap="BaseResultMap">
        SELECT 
        <include refid="Base_Column_List" />
        FROM ${tableName}
        <where>
            <if test="name != null and name != ''">
                AND name LIKE CONCAT('%', #{name}, '%')
            </if>
        </where>
        ORDER BY id DESC
    </select>

    <!-- 新增 -->
    <insert id="insert">
        INSERT INTO ${tableName} (
            ${insertColumns}
        ) VALUES (
            ${insertValues}
        )
    </insert>

    <!-- 根据ID更新 -->
    <update id="updateById">
        UPDATE ${tableName}
        <set>
            ${updateSets}
        </set>
        WHERE id = #{id}
    </update>

    <!-- 根据ID删除 -->
    <delete id="deleteById">
        DELETE FROM ${tableName}
        WHERE id = #{id}
    </delete>

</mapper>`;
  }

  /**
   * 生成 Service 接口
   */
  static generateService(
    entityPackage: string,
    entityClassName: string,
    packageName: string,
    className: string
  ): string {
    const simpleEntityName = entityClassName.replace('Entity', '');
    return `package ${packageName};

import ${entityPackage}.${entityClassName};
import java.util.List;

/**
 * ${simpleEntityName} Service
 */
public interface ${className} {

    ${entityClassName} selectById(Long id);

    List<${entityClassName}> selectList(${entityClassName} ${toCamelCase(simpleEntityName)});

    int insert(${entityClassName} ${toCamelCase(simpleEntityName)});

    int updateById(${entityClassName} ${toCamelCase(simpleEntityName)});

    int deleteById(Long id);
}`;
  }

  /**
   * 生成 ServiceImpl
   */
  static generateServiceImpl(
    entityPackage: string,
    entityClassName: string,
    mapperPackage: string,
    mapperClassName: string,
    servicePackage: string,
    serviceClassName: string,
    packageName: string,
    className: string
  ): string {
    const simpleEntityName = entityClassName.replace('Entity', '');
    return `package ${packageName};

import ${entityPackage}.${entityClassName};
import ${mapperPackage}.${mapperClassName};
import ${servicePackage}.${serviceClassName};
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * ${simpleEntityName} Service 实现类
 */
@Service
public class ${className} implements ${serviceClassName} {

    @Autowired
    private ${mapperClassName} ${mapperClassName.charAt(0).toLowerCase() + mapperClassName.slice(1)};

    @Override
    public ${entityClassName} selectById(Long id) {
        return ${mapperClassName.charAt(0).toLowerCase() + mapperClassName.slice(1)}.selectById(id);
    }

    @Override
    public List<${entityClassName}> selectList(${entityClassName} ${toCamelCase(simpleEntityName)}) {
        return ${mapperClassName.charAt(0).toLowerCase() + mapperClassName.slice(1)}.selectList(${toCamelCase(simpleEntityName)});
    }

    @Override
    public int insert(${entityClassName} ${toCamelCase(simpleEntityName)}) {
        return ${mapperClassName.charAt(0).toLowerCase() + mapperClassName.slice(1)}.insert(${toCamelCase(simpleEntityName)});
    }

    @Override
    public int updateById(${entityClassName} ${toCamelCase(simpleEntityName)}) {
        return ${mapperClassName.charAt(0).toLowerCase() + mapperClassName.slice(1)}.updateById(${toCamelCase(simpleEntityName)});
    }

    @Override
    public int deleteById(Long id) {
        return ${mapperClassName.charAt(0).toLowerCase() + mapperClassName.slice(1)}.deleteById(id);
    }
}`;
  }

  /**
   * 生成 Controller
   */
  static generateController(
    entityPackage: string,
    entityClassName: string,
    servicePackage: string,
    serviceClassName: string,
    dtoPackage: string,
    packageName: string,
    className: string,
    tableComment: string
  ): string {
    const simpleEntityName = entityClassName.replace('Entity', '');
    const simpleServiceName = serviceClassName.replace('Service', '');
    const requestPath = simpleEntityName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');

    return `package ${packageName};

import ${entityPackage}.${entityClassName};
import ${servicePackage}.${serviceClassName};
import ${dtoPackage}.${simpleEntityName}RequestDTO;
import ${dtoPackage}.${simpleEntityName}VO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * ${tableComment || simpleEntityName} Controller
 */
@RestController
@RequestMapping("/${requestPath}")
public class ${className} {

    @Autowired
    private ${serviceClassName} ${simpleServiceName.charAt(0).toLowerCase() + simpleServiceName.slice(1)};

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ${simpleEntityName}VO getById(@PathVariable Long id) {
        ${entityClassName} entity = ${simpleServiceName.charAt(0).toLowerCase() + simpleServiceName.slice(1)}.selectById(id);
        return convertToVO(entity);
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    public List<${simpleEntityName}VO> getList(${entityClassName} ${toCamelCase(simpleEntityName)}) {
        List<${entityClassName}> list = ${simpleServiceName.charAt(0).toLowerCase() + simpleServiceName.slice(1)}.selectList(${toCamelCase(simpleEntityName)});
        return list.stream().map(this::convertToVO).toList();
    }

    /**
     * 新增
     */
    @PostMapping
    public ${simpleEntityName}VO create(@RequestBody ${simpleEntityName}RequestDTO requestDTO) {
        ${entityClassName} entity = convertToEntity(requestDTO);
        ${simpleServiceName.charAt(0).toLowerCase() + simpleServiceName.slice(1)}.insert(entity);
        return convertToVO(entity);
    }

    /**
     * 更新
     */
    @PutMapping("/{id}")
    public ${simpleEntityName}VO update(@PathVariable Long id, @RequestBody ${simpleEntityName}RequestDTO requestDTO) {
        ${entityClassName} entity = convertToEntity(requestDTO);
        entity.setId(id);
        ${simpleServiceName.charAt(0).toLowerCase() + simpleServiceName.slice(1)}.updateById(entity);
        return convertToVO(entity);
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ${simpleServiceName.charAt(0).toLowerCase() + simpleServiceName.slice(1)}.deleteById(id);
    }

    private ${simpleEntityName}VO convertToVO(${entityClassName} entity) {
        ${simpleEntityName}VO vo = new ${simpleEntityName}VO();
        // TODO: 实现转换逻辑
        return vo;
    }

    private ${entityClassName} convertToEntity(${simpleEntityName}RequestDTO dto) {
        ${entityClassName} entity = new ${entityClassName}();
        // TODO: 实现转换逻辑
        return entity;
    }
}`;
  }

  /**
   * 生成 DTO
   */
  static generateDTO(
    tableComment: string,
    columns: ColumnSchema[],
    packageName: string,
    className: string
  ): string {
    const imports = new Set<string>();
    imports.add('lombok.Data');
    imports.add('lombok.NoArgsConstructor');
    imports.add('lombok.AllArgsConstructor');

    const fields = columns.map((col) => {
      const javaType = dbTypeToJava(col.dataType);
      const fieldName = toCamelCase(col.columnName);

      if (javaType === 'Date') {
        imports.add('java.util.Date');
      } else if (javaType === 'BigDecimal') {
        imports.add('java.math.BigDecimal');
      } else if (javaType === 'Boolean') {
        imports.add('java.lang.Boolean');
      }

      return `    private ${javaType} ${fieldName};`;
    });

    return `package ${packageName};

${Array.from(imports)
  .map((imp) => `import ${imp};`)
  .join('\n')}

/**
 * ${tableComment || 'DTO'}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ${className} {

${fields.join('\n\n')}
}`;
  }

  /**
   * 生成 VO
   */
  static generateVO(
    tableComment: string,
    columns: ColumnSchema[],
    packageName: string,
    className: string
  ): string {
    const imports = new Set<string>();
    imports.add('lombok.Data');
    imports.add('lombok.NoArgsConstructor');
    imports.add('lombok.AllArgsConstructor');

    const fields = columns.map((col) => {
      const javaType = dbTypeToJava(col.dataType);
      const fieldName = toCamelCase(col.columnName);

      if (javaType === 'Date') {
        imports.add('java.util.Date');
      } else if (javaType === 'BigDecimal') {
        imports.add('java.math.BigDecimal');
      } else if (javaType === 'Boolean') {
        imports.add('java.lang.Boolean');
      }

      return `    private ${javaType} ${fieldName};`;
    });

    return `package ${packageName};

${Array.from(imports)
  .map((imp) => `import ${imp};`)
  .join('\n')}

/**
 * ${tableComment || 'VO'}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ${className} {

${fields.join('\n\n')}
}`;
  }
}
