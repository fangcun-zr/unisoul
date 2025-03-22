package generator.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.domain.Doctor;
import generator.exception.BusinessException;
import org.springframework.web.multipart.MultipartFile;

public interface DoctorService {
    boolean registerDoctor(Doctor doctor,
                           MultipartFile photo,
                           MultipartFile certificate) throws BusinessException;

    Page<Doctor> listDoctors(int current, int pageSize);
    Doctor getDoctorWithSchedule(Integer id);
    Boolean sendCheckCode(String email, String code);
}