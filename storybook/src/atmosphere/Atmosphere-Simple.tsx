/// <reference types="vite/types/importMeta.d.ts" />

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { SMAA, ToneMapping } from '@react-three/postprocessing'
import type { StoryFn } from '@storybook/react-vite'
import { useEffect, useRef, useState, type ComponentRef, type FC } from 'react'

import {
  Atmosphere,
  Sky,
  SkyLight,
  SunLight,
  type AtmosphereApi
} from '@takram/three-atmosphere/r3f'
import { Geodetic, PointOfView, radians } from '@takram/three-geospatial'
import { EastNorthUpFrame, EllipsoidMesh } from '@takram/three-geospatial/r3f'

import { EffectComposer } from '../helpers/EffectComposer'
import { Stats } from '../helpers/Stats'
import { useControls } from '../helpers/useControls'
import { useLocalDateControls } from '../helpers/useLocalDateControls'
import { useToneMappingControls } from '../helpers/useToneMappingControls'

// Posição geográfica simples (Tóquio, Japão)
const geodetic = new Geodetic(radians(139.7), radians(35.7), 1000)
const position = geodetic.toECEF()

const Scene: FC = () => {
  // Configuração simples de exposição
  const { toneMappingMode } = useToneMappingControls({ exposure: 5 })

  // Controle simples de hora do dia
  const motionDate = useLocalDateControls()

  // Controle básico para mostrar/ocultar elementos
  const { showSky, showSun, showStars } = useControls('visuais', {
    showSky: { value: true, label: 'Mostrar Céu' },
    showSun: { value: true, label: 'Mostrar Sol' },
    showStars: { value: false, label: 'Mostrar Estrelas' }
  })

  // Controle de qualidade baseado no tamanho da tela
  const { quality } = useControls('qualidade', {
    quality: {
      value: 'medium' as const,
      options: ['low', 'medium', 'high'] as const,
      label: 'Qualidade Visual'
    }
  })

  // Ajustar resolução baseada na qualidade
  const getResolution = (): [number, number] => {
    switch (quality) {
      case 'low':
        return [32, 16]
      case 'medium':
        return [64, 32]
      case 'high':
        return [128, 64]
    }
  }

  const [segmentsX, segmentsY] = getResolution()

  const camera = useThree(({ camera }) => camera)
  const [controls, setControls] = useState<ComponentRef<
    typeof OrbitControls
  > | null>(null)

  useEffect(() => {
    // Posição inicial da câmera
    const pov = new PointOfView(5000, radians(-90), radians(-15))
    pov.decompose(position, camera.position, camera.quaternion, camera.up)
    if (controls != null) {
      controls.target.copy(position)
      controls.update()
    }
  }, [camera, controls])

  const atmosphereRef = useRef<AtmosphereApi>(null)
  useFrame(() => {
    const atmosphere = atmosphereRef.current
    if (atmosphere == null) {
      return
    }
    // Atualiza a atmosfera baseada na hora atual
    atmosphere.updateByDate(new Date(motionDate.get()))
  })

  return (
    <Atmosphere ref={atmosphereRef}>
      <OrbitControls ref={setControls} />

      {/* Elementos visuais básicos */}
      {showSky && <Sky />}
      {showSun && <SunLight />}
      {showStars && <SkyLight />}

      {/* Malha elipsoidal com resolução ajustável */}
      <EllipsoidMesh
        args={[6371000, segmentsX, segmentsY] as [number, number, number]}
      >
        <meshLambertMaterial color='#4a90e2' />
      </EllipsoidMesh>

      {/* Exemplo de objeto na superfície */}
      <EastNorthUpFrame {...geodetic}>
        <mesh position={[0, 0, 50]}>
          <boxGeometry args={[100, 100, 100]} />
          <meshLambertMaterial color='white' />
        </mesh>
      </EastNorthUpFrame>

      {/* Pós-processamento básico */}
      <EffectComposer multisampling={0}>
        <ToneMapping mode={toneMappingMode} />
        <SMAA />
      </EffectComposer>
    </Atmosphere>
  )
}

const Story: StoryFn = () => (
  <Canvas
    gl={{
      depth: false,
      logarithmicDepthBuffer: true
    }}
    camera={{ near: 100, far: 1e6 }}
  >
    <Stats />
    <Scene />
  </Canvas>
)

export default Story
