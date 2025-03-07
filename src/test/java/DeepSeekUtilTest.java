import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zr.uniSoul.UniSoulApplication;
import com.zr.uniSoul.pojo.dto.AnswerDTO;
import com.zr.uniSoul.pojo.entity.Options;
import com.zr.uniSoul.utils.DeepSeekUtil;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = UniSoulApplication.class)
@ActiveProfiles("test")
public class DeepSeekUtilTest {

    @InjectMocks
    private DeepSeekUtil deepSeekUtil; // 不要在这里手动new

    @Mock
    private CloseableHttpClient httpClient;

    @Mock
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        // 使用MockitoAnnotations.openMocks(this)初始化mock对象
        MockitoAnnotations.openMocks(this);

        // 如果有需要设置的属性值，可以直接在这里设置
        // deepSeekUtil.setApiKey("your-test-api-key");
        // deepSeekUtil.setApiUrl("your-test-api-url");
    }

    @Test
    public void testProcessAssessment() throws Exception {
        // Arrange
        AnswerDTO answerDTO = new AnswerDTO();
        answerDTO.setAssessmentSessionId("test-session-id");
        answerDTO.setId(1);

        Options option1 = new Options();
        option1.setTopic("你是否自恋");
        option1.setOptions("是");

        Options option2 = new Options();
        option2.setTopic("你是否会想自杀");
        option2.setOptions("有时候想");

        Options option3 = new Options();
        option3.setTopic("你是否会感到孤独");
        option3.setOptions("经常会");

        answerDTO.setAnswers(Arrays.asList(option1, option2, option3));

        String jsonResponse = "{\"choices\":[{\"message\":{\"content\":\"这里是AI提供的建议\"}}]}";
        InputStream inputStream = new ByteArrayInputStream(jsonResponse.getBytes(StandardCharsets.UTF_8));

        CloseableHttpResponse mockResponse = mock(CloseableHttpResponse.class);

        // 确保实体不会返回 null
        when(mockResponse.getEntity()).thenReturn(mock(org.apache.http.HttpEntity.class));
        when(mockResponse.getEntity().getContent()).thenReturn(inputStream);
        when(httpClient.execute(any(HttpPost.class))).thenReturn(mockResponse);

        // 使用已经存在的 objectMapper 实例来读取 JSON 响应
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        when(objectMapper.readTree(any(InputStream.class))).thenReturn(jsonNode);

        // Act
        String result = deepSeekUtil.processAssessment(answerDTO);

        // Assert
        assertEquals("这里是AI提供的建议", result);
    }
}