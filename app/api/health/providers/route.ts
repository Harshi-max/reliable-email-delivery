import { NextResponse } from "next/server"
import { providerHealthHistoryStore } from "@/lib/monitoring/providerHealthHistory"

export async function GET() {
  const data = providerHealthHistoryStore.getAllHistory()

  return NextResponse.json({
    success: true,
    providers: data,
    timestamp: new Date().toISOString(),
  })
}
