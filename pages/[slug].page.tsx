import Layout from '~/components/Layout'
import StyledMarkdown from '~/components/StyledMarkdown'
import Head from 'next/head'
import React from 'react'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'
import { SectionContext } from '~/context'

export async function getStaticPaths() { return getStaticMarkdownPaths('pages') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages') }

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Layout>
        <Head>
          <title>JSON Schema - {frontmatter.title}</title>
        </Head>
        <Headline1>{frontmatter.title}</Headline1>
        <StyledMarkdown markdown={content} />
      </Layout>
    </SectionContext.Provider>
  )
}
