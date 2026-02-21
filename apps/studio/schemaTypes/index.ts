import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './category'
import { regionType } from './region'
import { resourceType } from './resource'
import { seoType } from './seo'
import { structuredDataType } from './structuredData'

export const schemaTypes: SchemaTypeDefinition[] = [
    seoType,
    structuredDataType,
    categoryType,
    regionType,
    resourceType,
]
