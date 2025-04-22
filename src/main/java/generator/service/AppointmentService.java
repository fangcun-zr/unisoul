package generator.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import generator.domain.Appointment;
import generator.exception.BusinessException;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;

public interface AppointmentService {
    boolean createAppointment(Appointment appointment) throws BusinessException;
    boolean cancelAppointment(Integer id);
    Page<Appointment> listAppointments(int current, int pageSize, String status, Date appointmentDate, Date startDate, Date endDate);
    boolean updateStatus(Integer id, String status) throws BusinessException;
    void exportAppointments(HttpServletResponse response, String status, Date startDate, Date endDate, String consultationType) throws IOException;
    Page<Appointment> getPatientHistory(String patientName, String patientPhone, int current, int pageSize);
    List<String> getAvailableTimeSlots(Integer doctorId, Date date) throws BusinessException;
}