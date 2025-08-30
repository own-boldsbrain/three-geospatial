import type { Meta } from '@storybook/react-vite'

import _Basic from './Atmosphere-Basic'
import _LightingMask from './Atmosphere-LightingMask'
import _Simple from './Atmosphere-Simple'
import _Vanilla from './Atmosphere-Vanilla'
import _WorldOriginRebasing from './Atmosphere-WorldOriginRebasing'

export default {
  title: 'atmosphere/Atmosphere',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Atmosphere Component

Este componente demonstra o sistema de atmosfera geoespacial, incluindo céu, estrelas, luz solar e efeitos de perspectiva aérea.

## Funcionalidades

- **Renderização de Céu**: Simulação realista do céu com base na posição geográfica e hora do dia
- **Estrelas**: Renderização de estrelas visíveis no céu noturno
- **Iluminação**: Dois modos de iluminação - pós-processamento e fonte de luz direta
- **Perspectiva Aérea**: Efeitos de dispersão atmosférica para profundidade visual
- **Correção de Altitude**: Ajuste automático da atmosfera baseado na altitude

## Controles Interativos

Use os painéis de controle no lado direito para ajustar:
- **Effects**: Ativar/desativar efeitos como lens flare, depth e normal
- **Atmosphere**: Configurações da atmosfera, incluindo correção de altitude
- **Aerial Perspective**: Controle dos efeitos de perspectiva aérea
- **Lighting**: Modo de iluminação e fontes de luz
- **Tone Mapping**: Ajustes de exposição e mapeamento de tom
        `
      }
    }
  }
} satisfies Meta

export const Basic = _Basic
export const LightingMask = _LightingMask
export const Simple = _Simple
export const WorldOriginRebasing = _WorldOriginRebasing
export const Vanilla = _Vanilla
