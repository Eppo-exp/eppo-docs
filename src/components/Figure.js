import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function Figure({children, alt, src}) {
  return (
    <figure>
      <img src={useBaseUrl(src)} alt={alt} />
      <figcaption>{children}</figcaption>
    </figure>
  )
}