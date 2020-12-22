import styled from "styled-components"

export default styled.article`
  color: #6d757b;
  font-size: 1rem;
  h1, h2, h3, h4, h5, h6 {
    text-transform: none;
  }
  h1 {
    border-bottom: 1px solid #aaaaaa;
    margin: 50px 0 30px;
  }
  strong {
    font-weight: bold;
    /* color: #5a5a5a; */
  }
  h2 {
    margin-top: 30px;
  }
  h3 {
    margin-top: 30px;
  }
  pre[class*=language-] {
    background: #08223e;
  }

  * :not(pre) > code[class*="language-"] {
    background: #F2F5EA;
    color: #F28482;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0 5px;
  }

  a {
    color: #E75A7C;
    font-weight: bolder;
  }

  p, li {
    line-height: 1.8;
    font-size: 1.2rem
  }
`;