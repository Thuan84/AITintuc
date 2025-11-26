import { GoogleGenAI, Chat, Content, Type } from "@google/genai";
import { TrendingNewsItem } from "../types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string, // ✅ ĐÃ ĐỔI TÊN BIẾN
});

export const createChatSession = (history?: Content[]): Chat => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    history,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: `Bạn là VN News Bot - Trợ lý tin tức thông minh và đáng tin cậy.
      
      Nhiệm vụ:
      - Trả lời các câu hỏi về tin tức, sự kiện nóng hổi tại Việt Nam và thế giới.
      - SỬ DỤNG Google Search để tìm kiếm thông tin thực tế, chính xác và mới nhất.
      
      Quy tắc quan trọng về trích dẫn:
      - Để đảm bảo tính xác thực, hãy luôn nhắc đến tên nguồn tin trong câu trả lời (ví dụ: "Theo thông tin từ VnExpress...", "Báo Dân Trí cho biết...").
      - Tuyệt đối trung thực với dữ liệu tìm được.
      
      Xử lý nguồn tin Mạng xã hội (Facebook, Fanpage...):
      - Nếu người dùng hỏi tin từ Fanpage/Facebook, hãy tìm kiếm nội dung công khai (ví dụ search: "site:facebook.com [tên page] [từ khóa]").
      - Tuy nhiên, hãy CẢNH BÁO người dùng rằng tin từ mạng xã hội có thể chưa được kiểm chứng hoặc không hiển thị đầy đủ nếu bài viết không công khai.
      - Ưu tiên đối chiếu thông tin đó với các báo chính thống nếu có thể.
      
      Phong cách trình bày:
      - Ngắn gọn, trực diện, dễ hiểu.
      - Sử dụng Markdown (in đậm các ý chính).
      - Nếu tin tức có nhiều diễn biến, hãy tóm tắt theo gạch đầu dòng.
      
      Nếu người dùng hỏi chung chung (VD: "Tin mới hôm nay"), hãy tổng hợp 3-5 tin nổi bật nhất trong 24h qua.`,
    },
  });
};

export const getTrendingNews = async (): Promise<TrendingNewsItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "Tìm kiếm và tổng hợp 7 tin tức nóng hổi, quan trọng nhất đang diễn ra tại Việt Nam và thế giới trong 12 giờ qua. Đa dạng chủ đề (Thời sự, Thể thao, Công nghệ, Giải trí).",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Tiêu đề ngắn gọn, giật tít của tin tức",
              },
              summary: {
                type: Type.STRING,
                description: "Tóm tắt nội dung chính trong 1-2 câu",
              },
              category: {
                type: Type.STRING,
                description: "Chuyên mục (VD: Thời sự, Thể thao...)",
              },
              source: {
                type: Type.STRING,
                description: "Tên báo/nguồn tin chính (VD: VnExpress)",
              },
              timeAgo: {
                type: Type.STRING,
                description: "Thời gian ước lượng (VD: 2 giờ trước)",
              },
            },
            required: ["title", "summary", "category", "source"],
          },
        },
      },
    });

    const text = response.text(); // ✅ chuẩn cách lấy text
    if (!text) return [];

    return JSON.parse(text) as TrendingNewsItem[];
  } catch (error) {
    console.error("Error fetching trending news:", error);
    throw error;
  }
};
