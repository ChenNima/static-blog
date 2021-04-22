import React from "react"
import styled from "styled-components"
import Img from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "CC-BY-NC-ND.png" }) {
        childImageSharp {
          fixed(width: 88) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return <Img fixed={data.placeholderImage.childImageSharp.fixed} />
}

const CcStatement = ({ className }: StyledComponentProps) => (
  <div className={className}>
    <Image />
    <p>
      本作品采用
      <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank">
        知识共享署名4.0署名-非商业性使用-禁止演绎(BY-NC-ND)国际许可协议
      </a>进行许可，转载时请注明原文链接，图片在使用时请保留全部内容，但不得对本创作进行修改，亦不得依据本创作进行再创作，不得将本创作运用于商业用途。
    </p>
  </div>
);

export default styled(CcStatement)`
margin-top: 5rem;
a {
  color: #E75A7C;
  font-weight: bolder;
}
`;