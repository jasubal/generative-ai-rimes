/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ReactElement} from 'react'

import {
  runSimile,
  runExplode,
  runScene,
  runChain,
  runPOV,
  runAcronym,
  runAlliteration,
  runFuse,
  runUnexpect,
  runUnfold
} from '~/lib/macros'

import {
  SIMILE_PROMPT_COMPONENTS,
  EXPLODE_PROMPT_COMPONENTS,
  UNEXPECT_PROMPT_COMPONENTS,
  CHAIN_PROMPT_COMPONENTS,
  POV_PROMPT_COMPONENTS,
  ALLITERATION_PROMPT_COMPONENTS,
  ACRONYM_PROMPT_COMPONENTS,
  FUSE_PROMPT_COMPONENTS,
  SCENE_PROMPT_COMPONENTS,
  UNFOLD_PROMPT_COMPONENTS
} from '~/lib/priming'

import adaptPromptData from '~/lib/adaptPromptDataFormat'
import {t} from './translations'

declare global {
  /* eslint-disable-next-line no-unused-vars */
  interface Window {
    dataLayer: any
    webkitSpeechRecognition: any
  }
}

export interface IBreakPoints {
  medium: number
  large: number
  [x: string]: number
}

export const breakPoints: IBreakPoints = {
  medium: 680,
  large: 1180
}

export const colors = {
  dark: '#151515',
  dark_grey: '#2c2c2c',
  mid_grey: '#666666',
  light_grey: '#999999',
  tennis: '#DAEF68',
  tomato: '#e24326',
  lavender: '#C0BAF2',
  mint: '#73D29E',
  cardboard: '#BAA694',
  coral: '#FF8C67',
  sky: '#81C2EC',
  barbie: '#FA9CC6',
  marigold: '#FFCE00',
  berry: '#8F9BFF',
  water: '#91FAED'
}

export interface IWatchLupeUseItVideos {
  [x: string]: string
}

export const watchLupeUseItVideos: IWatchLupeUseItVideos = {
  simile: 'https://storage.googleapis.com/textfx-assets/WLUI_SIMILE.mp4',
  explode: 'https://storage.googleapis.com/textfx-assets/WLUI_EXPLODE.mp4',
  unexpect: 'https://storage.googleapis.com/textfx-assets/WLUI_UNEXPECT.mp4',
  chain: 'https://storage.googleapis.com/textfx-assets/WLUI_CHAIN.mp4',
  pov: 'https://storage.googleapis.com/textfx-assets/WLUI_POV.mp4',
  alliteration:
    'https://storage.googleapis.com/textfx-assets/WLUI_ALLITERATION.mp4',
  acronym: 'https://storage.googleapis.com/textfx-assets/WLUI_ACRONYM.mp4',
  fuse: 'https://storage.googleapis.com/textfx-assets/WLUI_FUSE.mp4',
  scene: 'https://storage.googleapis.com/textfx-assets/WLUI_SCENE.mp4',
  unfold: 'https://storage.googleapis.com/textfx-assets/WLUI_UNFOLD.mp4'
}

export interface IMacro {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  color: string
  videoUrl: string
  lottie: string
  loadingAnimation: Function
  inputs: {
    label: string
    placeholder: string[]
    maxLength?: number | string
    allowSpaces?: boolean
    maxLengthDescription?: string
    type?: string
  }[]
  apiFunction: Function
  getCardLabel?: Function
  textLabel: string
}

export const macros: IMacro[] = [
  {
    id: 'simile',
    name: t('macro.simile'),
    slug: 'simile',
    icon: 'simile',
    textLabel: '============= SIMILE =============',
    description: t('desc.simile'),
    color: colors.tennis,
    videoUrl: watchLupeUseItVideos.simile,
    lottie: 'simile_hero_animation_lottie',
    /**
     * SIMILE ANIMATION
     * Replace the letters of the input with = until the output is loaded.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = 0
      let modifiedText = ''
      let complete = false

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          iteration++
          lastTime = now
          const arr = text.split('')

          const i = Math.abs(
            (iteration % (text.length * 2)) - Math.floor(text.length)
          )

          modifiedText = arr
            .map(letter => (Math.random() > i / text.length ? '=' : letter))
            .join('')
          if (loaded && i === 0) complete = true
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.thingOrConcept'),
        placeholder: [
          t('ph.waiting'),
          t('ph.dilemma'),
          t('ph.keepingSecret'),
          t('ph.epiphany'),
          t('ph.startingOver'),
          t('ph.process')
        ],
        maxLength: 25
      }
    ],
    apiFunction: runSimile
  },
  {
    id: 'explode',
    name: t('macro.explode'),
    slug: 'explode',
    icon: 'explode',
    textLabel: '/-A-\\ /-A-\\ / EXPLODE \\ /-A-\\ /-A-\\',
    description: t('desc.explode'),
    color: colors.lavender,
    videoUrl: watchLupeUseItVideos.explode,
    lottie: 'explode_hero_animation_lottie',
    /**
     * EXPLODE ANIMATION
     * Put /\• between the letters of the input until the output is loaded.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = text.length || 0
      let modifiedText = ''
      let complete = false
      let chars = ['/', '\\']

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          iteration++
          lastTime = now
          const arr = text.split('')

          const i = Math.abs(
            (iteration % (text.length * 2)) - Math.floor(text.length)
          )

          if (i > text.length - 1) {
            arr.unshift(...arr.splice(0, i).join('•'))
          } else {
            arr.unshift(
              ...arr
                .splice(0, i)
                .map((letter, i) => `${letter}${chars[i % 2]}`)
                .join('')
            )
          }

          modifiedText = arr.join('')
          if (loaded && i === 0) complete = true
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.word'),
        placeholder: [
          t('ph.viability'),
          t('ph.helicopter'),
          t('ph.clarify'),
          t('ph.serendipity'),
          t('ph.organize'),
          t('ph.planetarium')
        ],
        maxLength: 15,
        allowSpaces: false
      }
    ],
    apiFunction: runExplode
  },
  {
    id: 'unexpect',
    name: t('macro.unexpect'),
    slug: 'unexpect',
    icon: 'unexpect',
    textLabel: '?????????????? UNEXPECT ???????????',
    description: t('desc.unexpect'),
    color: colors.mint,
    videoUrl: watchLupeUseItVideos.unexpect,
    lottie: 'unexpect_hero_animation_lottie',
    /**
     * UNEXPECT ANIMATION
     * Replace each letter in the input with a _ in sequence; include a /// spinner that turns into ??? when the output is loaded.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = 0
      let modifiedText = ''
      let complete = false
      let countdown = 5
      const spinner_chars = ['/', '—', '\\', '|']

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          iteration++
          lastTime = now
          const arr = text.split('')
          const i = Math.floor(Math.random() * text.length)
          arr.splice(i, 1, '_')
          if (loaded) countdown--
          const spinner1 = loaded
            ? countdown > 2
              ? '?'
              : ' '
            : spinner_chars[iteration % 4]
          const spinner2 = loaded
            ? countdown > 1
              ? '?'
              : ' '
            : spinner_chars[iteration % 4]
          const spinner3 = loaded
            ? countdown > 0
              ? '?'
              : ' '
            : spinner_chars[iteration % 4]
          modifiedText = `${arr.join('')} ${spinner1}${spinner2}${spinner3}`
          if (loaded && countdown === 0) complete = true
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.scene'),
        placeholder: [
          t('ph.glassWater'),
          t('ph.makingSandwich'),
          t('ph.aKey'),
          t('ph.changingBulb'),
          t('ph.chessGame'),
          t('ph.paragliding')
        ],
        maxLength: 25
      }
    ],
    apiFunction: runUnexpect
  },
  {
    id: 'chain',
    name: t('macro.chain'),
    slug: 'chain',
    icon: 'chain',
    textLabel: 'o-o-o-o-o-o-o CHAIN o-o-o-o-o-o-o-o',
    description: t('desc.chain'),
    color: colors.cardboard,
    videoUrl: watchLupeUseItVideos.chain,
    lottie: 'chain_hero_animation_lottie',
    /**
     * CHAIN ANIMATION
     * Loop with an arrow until the output is loaded.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = 0
      let modifiedText = ''
      let complete = false

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          iteration--
          lastTime = now
          const arr = `»${text}`.split('')
          const i = iteration % (text.length + 1)
          arr.unshift(...arr.splice(i))
          modifiedText = arr.join('')
          if (loaded && i === 0) complete = true
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.word'),
        placeholder: [
          t('ph.picture'),
          t('ph.ball'),
          t('ph.layer'),
          t('ph.soil'),
          t('ph.glass'),
          t('ph.coin')
        ],
        maxLength: 15
      }
    ],
    apiFunction: runChain
  },
  {
    id: 'pov',
    name: t('macro.pov'),
    slug: 'pov',
    icon: 'pov',
    textLabel: '^ ⦿ ⌄ ^ ⦿ ⌄   P.O.V.   ^ ⦿ ⌄ ^ ⦿ ⌄',
    description: t('desc.pov'),
    color: colors.coral,
    videoUrl: watchLupeUseItVideos.pov,
    lottie: 'pov_hero_animation_lottie',
    /**
     * POV ANIMATION
     * Shuffle the letters of the input until the output is loaded, then unshufle from the beginning.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = 0
      let modifiedText = ''
      let complete = false

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          if (loaded) iteration++
          lastTime = now
          const arr = text.split('')

          const i = iteration % text.length

          modifiedText = arr
            .concat(arr.splice(i).sort(() => Math.random() - 0.5))
            .join('')
          if (loaded && i === 0) complete = true
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.topic'),
        placeholder: [
          t('ph.analogClocks'),
          t('ph.succulents'),
          t('ph.minivans'),
          t('ph.turtlenecks'),
          t('ph.veganDesserts'),
          t('ph.sundays')
        ],
        maxLength: 25
      }
    ],
    apiFunction: runPOV
  },
  {
    id: 'alliteration',
    name: t('macro.alliteration'),
    slug: 'alliteration',
    icon: 'alliteration',
    textLabel: 'A_A_ A_A_  ALLITERATION  A_A_ A_A_ ',
    description: t('desc.alliteration'),
    color: colors.sky,
    videoUrl: watchLupeUseItVideos.alliteration,
    lottie: 'alliteration_hero_animation_lottie',
    /**
     * ALLITERATION ANIMATION
     * Shuffle the letters of the input until the output is loaded, then unshufle from the beginning.
     */
    loadingAnimation: (text: string) => {
      let fps = 10
      let interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = 0
      let modifiedText = ''
      let complete = false
      let j = 0

      const [inputText, letter] = text.split(/\sstarting with\s/)

      const startingWithText = ` starting with ${letter}`

      return (dt: number, loaded: boolean) => {
        now += dt
        interval = 1000 / fps
        if (now - lastTime > interval) {
          if (loaded) iteration++
          lastTime = now
          const arr = inputText.split('')
          const i = j > 0 ? inputText.length - 1 : iteration % inputText.length

          modifiedText = arr
            .concat(arr.splice(i).sort(() => Math.random() - 0.5))
            .join('')
          if (loaded && i === inputText.length - 1) {
            fps = 60
            j += 2
            modifiedText = `${modifiedText}${startingWithText.substring(0, j)}`
            if (j >= startingWithText.length - 1) {
              complete = true
            }
          }
        }

        if (complete) return false
        return modifiedText
      }
    },
    getCardLabel: (inputs: string[]) => {
      return `${inputs[0]} ${t('phrase.startingWith')} ${inputs[1].toUpperCase()}`
    },
    inputs: [
      {
        label: t('label.topic'),
        placeholder: [
          t('ph.animals'),
          t('ph.historicalFigures'),
          t('ph.musicalInstruments'),
          t('ph.techThings'),
          t('ph.fitPocket'),
          t('ph.foodAdjectives')
        ],
        maxLength: 50
      },
      {
        label: t('label.wordsStarting'),
        placeholder: [],
        type: 'dropdown'
      }
    ],
    apiFunction: runAlliteration
  },
  {
    id: 'acronym',
    name: t('macro.acronym'),
    slug: 'acronym',
    icon: 'acronym',
    textLabel: 'R.A.P. R.A.P. ACRONYM  R.A.P. R.A.P.',
    description: t('desc.acronym'),
    color: colors.barbie,
    videoUrl: watchLupeUseItVideos.acronym,
    lottie: 'acronym_hero_animation_lottie',
    /**
     * ACRONYM ANIMATION
     * Add dots between the letters of the input.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = text?.length || 0
      let modifiedText = ''
      let complete = false

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          iteration++
          lastTime = now
          const arr = text.split('')

          const i = Math.abs(
            (iteration % (text.length * 2)) - Math.floor(text.length)
          )

          arr.unshift(...arr.splice(0, i).join('.'))
          modifiedText = arr.join('')
          if (loaded && i === 0) complete = true
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.word'),
        placeholder: [
          t('ph.metro'),
          t('ph.word'),
          t('ph.rap'),
          t('ph.flare'),
          t('ph.name'),
          t('ph.space')
        ],
        maxLength: 15
      }
    ],
    apiFunction: runAcronym
  },
  {
    id: 'fuse',
    name: t('macro.fuse'),
    slug: 'fuse',
    icon: 'fuse',
    textLabel: 'OO OO OO OO OO FUSE OO OO OO OO OO',
    description: t('desc.fuse'),
    color: colors.marigold,
    videoUrl: watchLupeUseItVideos.fuse,
    lottie: 'fuse_hero_animation_lottie',
    /**
     * FUSE ANIMATION
     * Shuffle the two words together until output is loaded, then unshuffle words with an ≈ in the middle.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = 0
      let modifiedText = ''
      let complete = false

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          if (loaded) iteration++
          lastTime = now
          const arr = text.split('')

          const i = iteration % text.length

          modifiedText = arr
            .concat(arr.splice(i).sort(() => Math.random() - 0.5))
            .join('')

          if (iteration === 0) modifiedText = modifiedText.replace(/[\s]/g, '')
          if (iteration === 1) modifiedText = text.replace(/[\s]/g, '')
          if (iteration > 1) modifiedText = text
          if (loaded && iteration >= 2) complete = true
        }

        if (complete) return false
        return modifiedText
      }
    },
    getCardLabel: (inputs: string[]) => {
      return `${inputs[0]} ≈ ${inputs[1]}`
    },
    inputs: [
      {
        label: t('label.thing'),
        placeholder: [
          t('ph.library'),
          t('ph.coding'),
          t('ph.mango'),
          t('ph.romance'),
          t('ph.parrot'),
          t('ph.compliment')
        ],
        maxLength: 15
      },
      {
        label: t('label.anotherOne'),
        placeholder: [
          t('ph.graveyard'),
          t('ph.poetry'),
          t('ph.pictureFrame'),
          t('ph.democracy'),
          t('ph.octopus'),
          t('ph.insult')
        ],
        maxLength: 15
      }
    ],
    apiFunction: runFuse
  },
  {
    id: 'scene',
    name: t('macro.scene'),
    slug: 'scene',
    icon: 'scene',
    textLabel: '•_-_-_ •_-_-_  SCENE •_-_-_ •_-_-_',
    description: t('desc.scene'),
    color: colors.berry,
    videoUrl: watchLupeUseItVideos.scene,
    lottie: 'scene_hero_animation_lottie',
    /**
     * SCENE ANIMATION
     * Replace the letters of the input with a pattern of dots and dashes.
     */
    loadingAnimation: (text: string) => {
      const fps = 10 + Math.ceil(text.length / 10) // Adapt speed to text length
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = 0
      let modifiedText = ''
      let complete = false
      const pattern = '__…-…___…__……___…-…__…-…__…__…-…___…__…-…___…-…__…-…_…'
      const start = Math.random() * (pattern.length - text.length)
      const replacement = pattern.substring(start, start + text.length)

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          iteration++
          lastTime = now
          const replacement_arr = replacement.split('')

          const i = iteration % (text.length * 2)

          if (i > text.length) {
            const j = i - text.length
            modifiedText = `${text.substring(
              0,
              Math.max(0, j - 1)
            )}/${replacement_arr.splice(j).join('')}`
          } else {
            modifiedText = `${replacement_arr
              .slice(0, i)
              .join('')}/${text.substring(i + 1)}`
          }

          if (loaded && i === 0) {
            complete = true
          }
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.scene'),
        placeholder: [
          t('ph.checkinHotel'),
          t('ph.reheatedTakeout'),
          t('ph.firstDate'),
          t('ph.autoShop'),
          t('ph.musicFestival'),
          t('ph.dentist')
        ],
        maxLength: 25
      }
    ],
    apiFunction: runScene
  },
  {
    id: 'unfold',
    name: t('macro.unfold'),
    slug: 'unfold',
    icon: 'unfold',
    textLabel: '<-> <-> <-> < UNFOLD > <-> <-> <->',
    description: t('desc.unfold'),
    color: colors.water,
    videoUrl: watchLupeUseItVideos.unfold,
    lottie: 'unfold_hero_animation_lottie',
    /**
     * UNFOLD ANIMATION
     * Bounce from side to side using the _ character.
     */
    loadingAnimation: (text: string) => {
      const fps = 10
      const interval = 1000 / fps

      let now = interval
      let lastTime = 0
      let iteration = text.length || 0
      let modifiedText = ''
      let complete = false
      let underscores = '____'
      let countingDown = false

      return (dt: number, loaded: boolean) => {
        now += dt
        if (now - lastTime > interval) {
          iteration++
          lastTime = now

          const i = Math.abs(
            (iteration % (underscores.length * 2)) -
              Math.floor(underscores.length)
          )

          if (loaded && i === 0) countingDown = true
          if (countingDown) {
            if (underscores.length === 0) complete = true
            underscores = underscores.substring(0, underscores.length - 1)
            modifiedText = `${text}${underscores}`
          } else {
            const before = underscores.split('')
            const after = before.splice(i)
            modifiedText = `${before.join('')}${text}${after.join('')}`
          }
        }

        if (complete) return false
        return modifiedText
      }
    },
    inputs: [
      {
        label: t('label.word'),
        placeholder: [
          t('ph.control'),
          t('ph.star'),
          t('ph.roof'),
          t('ph.hand'),
          t('ph.pin'),
          t('ph.blue')
        ],
        maxLength: 10,
        allowSpaces: false
      }
    ],
    apiFunction: runUnfold
  }
]

export interface IPromptDataItemRow {
  cols: {
    text: string
    title?: string
    background?: string
    style?: string
  }
}
export interface IPromptDataItemData {
  title: string
  rows: IPromptDataItemRow[]
}

export interface IPromptDataItem {
  description: ReactElement
  data: IPromptDataItemData[]
}

export interface IPromptData {
  simile: IPromptDataItem
  explode: IPromptDataItem
  unexpect: IPromptDataItem
  chain: IPromptDataItem
  pov: IPromptDataItem
  alliteration: IPromptDataItem
  acronym: IPromptDataItem
  fuse: IPromptDataItem
  scene: IPromptDataItem
  unfold: IPromptDataItem
}

const constructMacroExplainer = (taskDescription: string) => {
  return (
    <>
      <p>
        We can prime a large language model (LLM) to behave in a certain way
        using a <strong>prompt</strong>. A prompt is a string of text that
        contains examples of inputs and outputs for the desired task, and it
        helps the model recognize how it should respond to novel inputs.
        <br></br>
        <br></br>
        The table below shows how we primed the LLM to {taskDescription}. The
        format of this table is adapted from MakerSuite, which is a platform
        that makes it easy to build and experiment with LLM prompts. To learn
        more about MakerSuite, head{' '}
        <a
          href="https://developers.generativeai.google/products/makersuite"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('link.here')}
        </a>
        .
      </p>
    </>
  )
}

export const promptData: IPromptData = {
  simile: {
    description: constructMacroExplainer(t('pd.simile')),
    data: adaptPromptData(SIMILE_PROMPT_COMPONENTS)
  },
  explode: {
    description: constructMacroExplainer(t('pd.explode')),
    data: adaptPromptData(EXPLODE_PROMPT_COMPONENTS)
  },
  unexpect: {
    description: constructMacroExplainer(t('pd.unexpect')),
    data: adaptPromptData(UNEXPECT_PROMPT_COMPONENTS)
  },
  chain: {
    description: constructMacroExplainer(t('pd.chain')),
    data: adaptPromptData(CHAIN_PROMPT_COMPONENTS)
  },
  pov: {
    description: constructMacroExplainer(t('pd.pov')),
    data: adaptPromptData(POV_PROMPT_COMPONENTS)
  },
  alliteration: {
    description: constructMacroExplainer(t('pd.alliteration')),
    data: adaptPromptData(ALLITERATION_PROMPT_COMPONENTS)
  },
  acronym: {
    description: constructMacroExplainer(t('pd.acronym')),
    data: adaptPromptData(ACRONYM_PROMPT_COMPONENTS)
  },
  fuse: {
    description: constructMacroExplainer(t('pd.fuse')),
    data: adaptPromptData(FUSE_PROMPT_COMPONENTS)
  },
  scene: {
    description: constructMacroExplainer(t('pd.scene')),
    data: adaptPromptData(SCENE_PROMPT_COMPONENTS)
  },
  unfold: {
    description: constructMacroExplainer(t('pd.unfold')),
    data: adaptPromptData(UNFOLD_PROMPT_COMPONENTS)
  }
}

export interface IMacroOutput {
  id: string
  macro: string
  outputs: string[]
  inputs: string[]
  pins?: number[]
  randomness: number
}

export interface IPin {
  id: string
  index: number
  text: string
  macro: string
  input?: string
}

export const tippyOptions = {
  arrow: false,
  ignoreAttributes: true
}

export const ERROR_MESSAGE = t('error.internal')
export const NO_RESULTS_MESSAGE = t('error.noResults')
