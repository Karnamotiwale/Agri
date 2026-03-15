import { api } from "./api";

export async function askAI(question: string): Promise<string> {
    const res = await api.post("/api/v1/ai-advisory", { question });
    return res.data.answer;
}
