import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔍 API track-status LLAMADA')
  
  try {
    const trackId = req.nextUrl.searchParams.get('trackId')
    console.log('🎯 TrackId:', trackId)
    
    if (!trackId) {
      console.log('❌ trackId no proporcionado')
      return NextResponse.json({ error: 'trackId requerido' }, { status: 400 })
    }
    
    const SUNO_TOKEN = process.env.SUNO_COOKIE
    if (!SUNO_TOKEN) {
      console.log('❌ SUNO_COOKIE no configurada en .env.local')
      return NextResponse.json({ error: 'SUNO_COOKIE no configurada' }, { status: 500 })
    }
    
    console.log('📡 Llamando a usa.imgkits.com...')
    // ✅ Headers exactos de la extensión para evitar caché
    const response = await fetch(`https://usa.imgkits.com/node-api/suno/get_mj_status/${trackId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'es-419,es;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'origin': 'chrome-extension://ohdaboopddnmkhlkgailodgkoballoff',
        'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
      },
      cache: 'no-store'
    })
    
    console.log('📊 Response Status:', response.status)
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()))
    
    // Manejar respuestas que aún están procesando
    if (!response.ok) {
      if (response.status === 502 || response.status === 404 || response.status === 500) {
        console.log('⏳ Track aún procesando (error esperado)')
        return NextResponse.json({ 
          trackId, 
          status: 'processing', 
          audioUrl: null, 
          progress: 40 
        })
      }
      
      const errorText = await response.text().catch(() => 'No response body')
      console.log('❌ Error Response:', errorText)
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }
    
    // Obtener el texto de la respuesta primero
    const responseText = await response.text()
    console.log('📦 Raw Response:', responseText?.substring(0, 200) || 'Empty response')
    
    // Intentar parsear como JSON
    let data: any = {}
    if (responseText && responseText.trim().length > 0) {
      try {
        data = JSON.parse(responseText)
        console.log('📦 Parsed Data:', JSON.stringify(data, null, 2))
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError)
        console.log('📝 Response text:', responseText)
        // Si no se puede parsear, asumir que aún está procesando
        return NextResponse.json({ 
          trackId, 
          status: 'processing', 
          audioUrl: null, 
          progress: 50 
        })
      }
    } else {
      // Respuesta vacía = aún procesando
      console.log('⚠️ Respuesta vacía, asumiendo procesando...')
      return NextResponse.json({ 
        trackId, 
        status: 'processing', 
        audioUrl: null, 
        progress: 45 
      })
    }
    
    // ✅ ESTRUCTURA CORRECTA DE IMGKITS API
    // {code: 200, data: {callbackType: "complete", data: [{audio_url: "", id: "..."}]}}
    // callbackType: "text" = procesando
    // callbackType: "complete" = terminado
    let audioUrl = null
    let audioUrls: string[] = []
    
    // Verificar estructura correcta
    if (data.code === 200 && data.data && data.data.data && Array.isArray(data.data.data)) {
      const callbackType = data.data.callbackType
      console.log(`📊 Callback Type: ${callbackType}`)
      console.log(`📊 Clips encontrados: ${data.data.data.length}`)
      
      // ✅ CLAVE: Verificar callbackType para saber si terminó
      if (callbackType === 'complete') {
        // Generación completada - construir URLs desde los IDs
        audioUrls = data.data.data.map((clip: any) => {
          // La URL real es: https://cdn1.suno.ai/{id}.mp3
          const clipId = clip.id
          return `https://cdn1.suno.ai/${clipId}.mp3`
        })
        audioUrl = audioUrls[0]
        console.log(`✅ ${audioUrls.length} clips completados`)
        console.log(`🎵 Audio URLs construidas:`, audioUrls)
      } else if (callbackType === 'first') {
        // ⚡ OPTIMIZACIÓN: Primer track listo!
        const readyClips = data.data.data.filter((clip: any) => clip.audio_url && clip.audio_url.length > 0)
        if (readyClips.length > 0) {
          audioUrls = readyClips.map((clip: any) => `https://cdn1.suno.ai/${clip.id}.mp3`)
          audioUrl = audioUrls[0]
          console.log(`⚡ ${readyClips.length} clip(s) listo(s) - Streaming inmediato!`)
          console.log(`🎵 Audio URLs construidas:`, audioUrls)
        } else {
          console.log(`⏳ callbackType="first" pero audio_url vacío, esperando...`)
        }
      } else {
        // Aún procesando (callbackType: "text" o "pending")
        const streamUrls = data.data.data.map((clip: any) => clip.stream_audio_url || clip.source_stream_audio_url).filter(Boolean)
        console.log(`⏳ Aún procesando (${streamUrls.length} streams disponibles)`)
        console.log(`📡 Stream URLs:`, streamUrls)
      }
    } else {
      console.log('⚠️ Estructura de respuesta inesperada')
    }
    
    // Determinar status basado en callbackType
    let status = 'processing'
    if (data.data?.callbackType === 'complete') status = 'complete'
    else if (data.data?.callbackType === 'first' && audioUrls.length > 0) status = 'first_ready'
    
    const progress = status === 'complete' ? 100 : (status === 'first_ready' ? 75 : 70)
    
    console.log('✅ Status:', status)
    console.log('🎵 Audio URL:', audioUrl || 'null')
    if (audioUrls.length > 1) {
      console.log(`🎵 URLs adicionales: ${audioUrls.length - 1}`)
    }
    console.log('📈 Progress:', progress)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    return NextResponse.json({
      trackId,
      status,
      audioUrl,
      audioUrls: audioUrls.length > 0 ? audioUrls : undefined,
      progress
    })
    
  } catch (error: any) {
    console.error('❌ ERROR en track-status:', error)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return NextResponse.json({ 
      error: error.message || 'Error consultando estado del track',
      trackId: req.nextUrl.searchParams.get('trackId')
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
