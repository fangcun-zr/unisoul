package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * 患者预约信息表
 * @TableName appointment
 */
@TableName(value ="appointment")
@Data
public class Appointment {
    /**
     * 唯一标识ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 患者姓名
     */
    @TableField("patient_name")
    private String patientName;

    /**
     * 联系电话
     */
    @TableField("patient_phone")
    private String patientPhone;

    /**
     * 医生姓名
     */
    @TableField("doctor_name")
    private String doctorName;

    /**
     * 预约日期
     */
    @TableField("appointment_date")
    private Date appointmentDate;

    /**
     * 预约时间
     */
    @TableField("appointment_time")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime appointmentTime;

    /**
     * 咨询类型（如内科/外科/儿科等）
     */
    @TableField("consultation_type")
    private String consultationType;

    /**
     * 病情描述（可为空）
     */
    @TableField("condition_description")
    private String conditionDescription;

    /**
     * 预约创建时间
     */
    @TableField("created_at")
    private Date createdAt;

    /**
     * 最后更新时间
     */
    @TableField("updated_at")
    private Date updatedAt;

    /**
     * 预约状态（NEW/CONFIRMED/COMPLETED/CANCELLED）
     */
    private String status;




}