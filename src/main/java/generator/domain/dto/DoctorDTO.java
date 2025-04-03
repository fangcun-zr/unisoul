package generator.domain.dto;

import generator.domain.Doctor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Base64;

@Data
@EqualsAndHashCode(callSuper = true)
public class DoctorDTO extends Doctor {
    // Base64 编码的图片
    private String photoBase64;
    // Base64 编码的证书
    private String certificateBase64;

    /**
     * 将 Doctor 实体转换为 DTO
     */
    public static DoctorDTO fromEntity(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();

        // 复制基础字段
        dto.setId(doctor.getId());
        dto.setFullName(doctor.getFullName());
        dto.setGender(doctor.getGender());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setEmail(doctor.getEmail());
        dto.setBirthDate(doctor.getBirthDate());
        dto.setDepartment(doctor.getDepartment());
        dto.setLicenseNumber(doctor.getLicenseNumber());
        dto.setYearsOfExperience(doctor.getYearsOfExperience());
        dto.setIntroduction(doctor.getIntroduction());
        dto.setCreatedAt(doctor.getCreatedAt());
        dto.setUpdatedAt(doctor.getUpdatedAt());
        dto.setRecentSchedule(doctor.getRecentSchedule());

        return dto;
    }
}