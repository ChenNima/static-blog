import React, { ComponentType } from "react"
import Layout from "../../components/layout"

export default <T extends any>(Component: ComponentType<T>) => (props: T) => (
  <Layout>
    <Component {...props}/>
  </Layout>
);