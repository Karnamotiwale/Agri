const API_BASE = "http://localhost:5000";

interface PredictionData {
    soil_moisture: number;
    temperature: number;
    humidity: number;
    rain_forecast: number;
}

interface PredictionResponse {
    ml_prediction: number;
    final_decision: number;
    explanation: any;
}

interface FeedbackData {
    state: string;
    final_decision: number;
    outcome: string;
}

export async function predictIrrigation(data: PredictionData): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Prediction request failed");
    }

    return await response.json();
}

export async function sendFeedback(data: FeedbackData) {
    const response = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Feedback request failed");
    }

    return await response.json();
}
