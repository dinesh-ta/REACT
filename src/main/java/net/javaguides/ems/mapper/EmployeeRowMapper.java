package net.javaguides.ems.mapper;

import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.Employee;


public class EmployeeRowMapper {
    public static EmployeeDto mapToEmployeeDto(Employee employee){
        return new EmployeeDto ();
    }
}
