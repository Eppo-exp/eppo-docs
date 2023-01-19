import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function Icon({src}) {
  return (
      <img src={useBaseUrl(src)} alt={src} class="icon" />
  )
}