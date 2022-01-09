import Link from 'next/link'
import Image from 'next/image'

import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

const Navigation = function ({ total }) {
  const router = useRouter()
  let { id } = router.query
  id = parseInt(id)

  const [prevUrl, setPrevUrl] = useState("/" + total)
  const [nextUrl, setNextUrl] = useState("/2")

  useEffect(() => {
    let n = `/${id + 1}`
    if (id >= total) {
      n = `/1`
    }

    let p = `/${id - 1}`
    if (id <= 1) {
      p = `/${total}`
    }

    setPrevUrl(p)
    setNextUrl(n)
  }, [id, total])
  
  return (
    <nav>
      <Link href={prevUrl}>
        <a className="leftarrow">
          <Image
          src="/leftarrow.svg"
          alt="left facing arrow"
          className="arrow"
          />
        </a>
      </Link>
      <span>0{id}/0{total}</span>
      <Link href={nextUrl}>
      <a className="righarrow">
          <Image
          src="/rightarrow.svg"
          alt="right facing arrow"
          className="arrow"
          />
      </a> 
      </Link>
    </nav>
  )
}

export default Navigation;