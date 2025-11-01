'use client'

import { useState } from 'react'
import { useExtensionInstaller } from '../lib/extension-installer'
import { Button } from '@super-son1k/shared-ui'

interface TermsAcceptanceProps {
  userId: string
  onAccept?: () => void
}

export function TermsAcceptance({ userId, onAccept }: TermsAcceptanceProps) {
  const [accepted, setAccepted] = useState(false)
  const [installing, setInstalling] = useState(false)
  const { install, checkInstalled } = useExtensionInstaller()

  const handleAccept = async () => {
    setAccepted(true)
    setInstalling(true)

    try {
      // Install extension automatically
      const result = await install(userId)
      
      if (result.success) {
        // Extension installed, continue
        onAccept?.()
      } else {
        // Installation failed, but still continue (user can install manually later)
        console.warn('Extension installation failed:', result.error)
        onAccept?.()
      }
    } catch (error) {
      console.error('Extension installation error:', error)
      // Continue anyway
      onAccept?.()
    } finally {
      setInstalling(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Términos y Condiciones
        </h2>
        
        <div className="mb-6 text-sm text-gray-300 space-y-4 max-h-96 overflow-y-auto">
          <p>
            Al usar Son1kVerse, aceptas nuestros términos de servicio y política de privacidad.
          </p>
          
          <div>
            <h3 className="font-semibold text-white mb-2">Extensión del Navegador</h3>
            <p className="text-gray-400">
              Para una experiencia completa, instalamos automáticamente una extensión que mejora 
              la generación de música. Esta extensión funciona en segundo plano y no requiere 
              intervención tuya.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">Uso de Datos</h3>
            <p className="text-gray-400">
              La extensión únicamente recopila información necesaria para la generación de música 
              y se envía de forma segura a nuestros servidores.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">Privacidad</h3>
            <p className="text-gray-400">
              No almacenamos datos personales identificables. Todos los datos se procesan de 
              forma anónima y segura.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleAccept}
            disabled={installing}
            isLoading={installing}
            className="flex-1"
          >
            {installing ? 'Instalando extensión...' : 'Aceptar e Instalar'}
          </Button>
        </div>

        {accepted && installing && (
          <p className="mt-4 text-xs text-gray-400 text-center">
            La extensión se está instalando. Esto puede tomar unos segundos...
          </p>
        )}
      </div>
    </div>
  )
}

