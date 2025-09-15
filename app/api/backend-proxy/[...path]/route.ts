import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path, "GET")
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path, "POST")
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path, "PUT")
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyRequest(request, params.path, "DELETE")
}

async function proxyRequest(request: NextRequest, pathSegments: string[], method: string) {
  try {
    const path = pathSegments.join("/")
    const url = `${BACKEND_URL}/${path}`

    // Get request body for POST/PUT requests
    let body = undefined
    if (method === "POST" || method === "PUT") {
      try {
        body = await request.text()
      } catch (error) {
        // Handle empty body
        body = undefined
      }
    }

    // Forward query parameters
    const searchParams = new URL(request.url).searchParams
    const queryString = searchParams.toString()
    const finalUrl = queryString ? `${url}?${queryString}` : url

    // Make request to FastAPI backend
    const response = await fetch(finalUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Forward relevant headers
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
      body,
    })

    const data = await response.text()

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        // Enable CORS
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Backend proxy error:", error)
    return NextResponse.json({ error: "Backend service unavailable" }, { status: 503 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
