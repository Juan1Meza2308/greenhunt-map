export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  material: string;
  condition: string;
  ecoImpact: {
    co2Saved: number;
    waterSaved: number;
    treesSaved: number;
    wasteDiverted: number;
  };
}

export const CATEGORIES = [
  "Sofá", "Sillón", "Mesa", "Silla", "Estante", "Cama", "Armario",
  "Electrodoméstico", "Lámpara", "Bicicleta", "Ropa", "Cajas", "Otro",
];

export const MATERIALS = ["Madera", "Metal", "Plástico", "Tela", "Vidrio", "Mixto"];

export const CONDITIONS = ["Excelente", "Bueno", "Desgastado", "Para piezas"];

const ECO_SCORES: Record<string, AIAnalysisResult["ecoImpact"]> = {
  "Sofá":           { co2Saved: 35, waterSaved: 150, treesSaved: 1, wasteDiverted: 25 },
  "Sillón":         { co2Saved: 30, waterSaved: 120, treesSaved: 1, wasteDiverted: 20 },
  "Mesa":           { co2Saved: 20, waterSaved: 100, treesSaved: 2, wasteDiverted: 15 },
  "Silla":          { co2Saved: 15, waterSaved: 80,  treesSaved: 1, wasteDiverted: 8  },
  "Estante":        { co2Saved: 18, waterSaved: 90,  treesSaved: 2, wasteDiverted: 12 },
  "Cama":           { co2Saved: 40, waterSaved: 180, treesSaved: 3, wasteDiverted: 30 },
  "Armario":        { co2Saved: 45, waterSaved: 200, treesSaved: 4, wasteDiverted: 35 },
  "Electrodoméstico": { co2Saved: 25, waterSaved: 0, treesSaved: 0, wasteDiverted: 15 },
  "Lámpara":        { co2Saved: 10, waterSaved: 50,  treesSaved: 0, wasteDiverted: 5  },
  "Bicicleta":      { co2Saved: 40, waterSaved: 200, treesSaved: 0, wasteDiverted: 10 },
  "Ropa":           { co2Saved: 8,  waterSaved: 200, treesSaved: 0, wasteDiverted: 3  },
  "Cajas":          { co2Saved: 5,  waterSaved: 30,  treesSaved: 1, wasteDiverted: 2  },
  "Otro":           { co2Saved: 15, waterSaved: 80,  treesSaved: 1, wasteDiverted: 10 },
};

export function getEcoScore(category: string): AIAnalysisResult["ecoImpact"] {
  return ECO_SCORES[category] ?? ECO_SCORES["Otro"];
}

const FALLBACK_RESULT: AIAnalysisResult = {
  title: "Objeto reutilizable",
  description: "Objeto en buen estado encontrado en la calle. Puede ser rescatado por alguien que lo necesite.",
  category: "Otro",
  material: "Mixto",
  condition: "Bueno",
  ecoImpact: ECO_SCORES["Otro"],
};

export async function analyzeImage(base64Image: string): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    // Demo mode: simulate AI processing delay with a mock result
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      title: "Sillón de cuero vintage",
      description: "Sillón individual con estructura de madera. Desgaste menor en los reposabrazos, estructura firme.",
      category: "Sillón",
      material: "Tela",
      condition: "Bueno",
      ecoImpact: ECO_SCORES["Sillón"],
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analiza este objeto abandonado en la calle y responde SOLO con un objeto JSON válido (sin markdown, solo JSON puro) con exactamente esta estructura:
{"title":"nombre corto del objeto","description":"descripción de 1-2 frases del estado y características","category":"una de: Sofá, Sillón, Mesa, Silla, Estante, Cama, Armario, Electrodoméstico, Lámpara, Bicicleta, Ropa, Cajas, Otro","material":"uno de: Madera, Metal, Plástico, Tela, Vidrio, Mixto","condition":"uno de: Excelente, Bueno, Desgastado, Para piezas"}`,
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error("Empty response");

    // Strip markdown code fences if GPT wraps the JSON
    const content = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    console.log("[AI] raw response:", raw);

    const parsed = JSON.parse(content);
    const ecoImpact = getEcoScore(parsed.category);

    return {
      title: parsed.title || FALLBACK_RESULT.title,
      description: parsed.description || FALLBACK_RESULT.description,
      category: parsed.category || FALLBACK_RESULT.category,
      material: parsed.material || FALLBACK_RESULT.material,
      condition: parsed.condition || FALLBACK_RESULT.condition,
      ecoImpact,
    };
  } catch (error) {
    console.error("[AI] analysis failed:", error);
    return FALLBACK_RESULT;
  }
}
