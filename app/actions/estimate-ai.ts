"use server"

import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import type { Product } from "@/lib/api-mock"

/* -------------------------------------------------------------------------- */
/*                                Zod Schemas                                 */
/* -------------------------------------------------------------------------- */

const productSchema = z.object({
  name: z.string().describe("The name of the product or service."),
  category: z.string().describe("Category (e.g. Web, Branding, Marketing, Consulting, Other)."),
  defaultHours: z.number().int().min(1).describe("Estimated hours as a positive integer."),
  description: z.string().optional().describe("Optional product description."),
})

const estimateSchema = z.object({
  products: z
    .array(productSchema)
    .min(1)
    .describe("A list of suggested products and their estimated hours based on the client brief."),
})

/* -------------------------------------------------------------------------- */
/*                           AI Estimation Server Action                       */
/* -------------------------------------------------------------------------- */

export async function generateEstimateFromBrief(brief: string): Promise<{ products?: Product[]; error?: string }> {
  if (!brief.trim()) {
    return { error: "Client brief cannot be empty." }
  }

  try {
    const { object } = await generateObject({
      model: google("models/gemini-pro", {
        // Accept either env-var name
        apiKey: process.env.GOOGLE_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      schema: estimateSchema,
      prompt: `You are an expert estimator at a digital agency.
Analyse the following client brief and suggest appropriate products/services
(with sensible default hours) in JSON matching the given schema.

Brief:
"""
${brief}
"""`,
    })

    // Tag each AI-generated product so it behaves like a custom product
    const products: Product[] = object.products.map((p, idx) => ({
      ...p,
      id: `ai-${Date.now()}-${idx}`,
      isCustom: true,
    }))

    return { products }
  } catch (error) {
    console.error("Error generating estimate from AI:", error)
    return {
      error: "Failed to generate estimate from AI. Please try again later.",
    }
  }
}
