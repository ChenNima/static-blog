import styled from "styled-components"

export default styled.article`
  color: #6d757b;
  font-size: 1rem;
  h1 {
    border-bottom: 1px solid #aaaaaa;
    margin: 50px 0 30px;
  }
  strong {
    font-weight: bold;
    /* color: #5a5a5a; */
  }
  h3 {
    margin-top: 30px;
  }
  pre[class*=language-] {
    background: #08223e;
  }

  * :not(pre) > code[class*="language-"] {
    background: #dcebfb;
    color: #386388;
    white-space: pre-wrap;
    word-break: break-word;
  }

  a {
    color: #2360bb;
    font-weight: bolder;
  }
`;