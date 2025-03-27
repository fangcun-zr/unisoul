package com.zr.uniSoul.mapper;


import com.zr.uniSoul.pojo.entity.SensitiveWord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface SensitiveWordRepository{

    @Select("SELECT word FROM sensitive_words WHERE status = 1")
    List<String> findAllActiveWords();
}
