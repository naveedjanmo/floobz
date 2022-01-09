import Link from 'next/link'
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
          <img src="/leftarrow.svg" className="arrow"></img>
        </a>
      </Link>
      <span>0{id}/0{total}</span>
      <Link href={nextUrl}>
        <a className="rightarrow">
          <img src="/rightarrow.svg" className="arrow"></img>
        </a>
      </Link>
    </nav>
  )
}

export default Navigation;