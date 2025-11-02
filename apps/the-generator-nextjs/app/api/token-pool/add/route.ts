import { NextRequest, NextResponse } from 'next/server'
import { getTokenPoolManager } from '@/lib/token-pool-manager'

/**
 * ➕ ADD TOKEN TO POOL
 * 
 * Permite agregar un nuevo token al pool.
 */

export async function POST(req: NextRequest) {
  console.log('➕ Agregando token al pool...')
  
  try {
    const body = await req.json()
    const { userId, token, email, tier, label } = body
    
    // ✅ CORREGIDO: Permitir solo token (para extensión) o token completo (para admin)
    if (!token) {
      return NextResponse.json({ 
        success: false,
        error: 'Token requerido' 
      }, { status: 400 })
    }
    
    // Si viene de extensión (solo token y label), usar valores por defecto
    const isExtensionRequest = !userId && !email && !tier
    
    if (isExtensionRequest) {
      // Request desde extensión - usar valores por defecto
      const defaultUserId = 'extension-user'
      const defaultEmail = `extension-${Date.now()}@son1kverse.com`
      const defaultTier = 'FREE'
      
      const tokenManager = getTokenPoolManager()
      
      // Validar token contra API de Suno
      console.log('🔐 Validando token contra API Suno...')
      const isValid = await tokenManager.validateToken(token)
      
      if (!isValid) {
        return NextResponse.json({ 
          success: false,
          error: 'Token inválido o expirado según la API de Suno' 
        }, { status: 400 })
      }
      
      console.log('✅ Token válido, agregando al pool desde extensión...')
      
      // Agregar token al pool con valores por defecto
      const addedToken = await tokenManager.addToken({
        userId: defaultUserId,
        token,
        email: defaultEmail,
        tier: defaultTier
      })
      
      return NextResponse.json({
        success: true,
        message: 'Token agregado exitosamente al pool desde extensión',
        token: {
          id: addedToken.id,
          tier: addedToken.user_tier,
          max_uses: addedToken.max_uses,
          created_at: addedToken.created_at,
          label: label || 'extension-auto'
        }
      })
    }
    
    // Request completo (admin) - validar todos los parámetros
    if (!userId || !email || !tier) {
      return NextResponse.json({ 
        success: false,
        error: 'Faltan parámetros requeridos: userId, email, tier' 
      }, { status: 400 })
    }
    
    if (!['FREE', 'PREMIUM', 'ADMIN'].includes(tier)) {
      return NextResponse.json({ 
        success: false,
        error: 'Tier inválido. Debe ser FREE, PREMIUM o ADMIN' 
      }, { status: 400 })
    }
    
    // Validar formato de token (JWT básico)
    if (!token.match(/^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      return NextResponse.json({ 
        success: false,
        error: 'Formato de token inválido. Debe ser un JWT válido' 
      }, { status: 400 })
    }
    
    // Request completo - continuar con validación normal
    const tokenManager = getTokenPoolManager()
    
    // Validar token contra API de Suno
    console.log('🔐 Validando token contra API Suno...')
    const isValid = await tokenManager.validateToken(token)
    
    if (!isValid) {
      return NextResponse.json({ 
        success: false,
        error: 'Token inválido o expirado según la API de Suno' 
      }, { status: 400 })
    }
    
    console.log('✅ Token válido, agregando al pool...')
    
    // Agregar token al pool
    const addedToken = await tokenManager.addToken({
      userId,
      token,
      email,
      tier
    })
    
    return NextResponse.json({
      success: true,
      message: 'Token agregado exitosamente al pool',
      token: {
        id: addedToken.id,
        tier: addedToken.user_tier,
        max_uses: addedToken.max_uses,
        created_at: addedToken.created_at
      }
    })
    
  } catch (error: any) {
    console.error('❌ Error agregando token:', error)
    
    // Manejar error de duplicado
    if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json({ 
        success: false,
        error: 'Este token ya existe en el pool' 
      }, { status: 409 })
    }
    
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Error agregando token al pool'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

