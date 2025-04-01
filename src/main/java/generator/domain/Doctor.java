package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 医疗人员信息表
 * @TableName doctor
 */
@TableName(value ="doctor")
@Data
@SpringBootApplication
@EnableTransactionManagement
public class Doctor {
    /**
     * 唯一标识ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 姓名
     */
    @TableField("full_name")
    @JsonProperty("full_name")
    private String fullName;

    /**
     * 性别（中文枚举）
     */

    private Object gender;

    /**
     * 手机号（唯一约束）
     */
    @TableField("phone_number")
    @JsonProperty("phone_number")
    private String phoneNumber;

    /**
     * 邮箱（唯一约束）
     */
    private String email;

    /**
     * 出生日期
     */
    @TableField("birth_date")
    @JsonProperty("birth_date")
    private Date birthDate;

    /**
     * 所属科室
     */
    private String department;

    /**
     * 专业方向
     */
    private String specialty;

    /**
     * 执业证号（唯一约束）
     */
    @TableField("license_number")
    @JsonProperty("license_number")
    private String licenseNumber;

    /**
     * 从业年限（0-255年）se_number
     */
    @TableField("years_of_experience")
    @JsonProperty("years_of_experience")
    private Integer yearsOfExperience;

    /**
     * 个人简介（支持长文本）
     */
    private String introduction;

    /**
     * 创建时间
     */
    @TableField("created_at")
    @JsonProperty("created_at")
    private Date createdAt;

    /**
     * 最后更新时间
     */
    @TableField("updated_at")
    @JsonProperty("updated_at")
    private Date updatedAt;

    /**
     * 个人照片（大二进制对象）
     */
    private byte[] photo;

    /**
     * 资格证书（大二进制对象）
     */
    private byte[] certificate;

    /**
     * 新增非持久化字段 - 近期排班信息
     */
    @TableField(exist = false)  // 标注该字段不存在于数据库表中
    private List<Appointment> recentSchedule;
}