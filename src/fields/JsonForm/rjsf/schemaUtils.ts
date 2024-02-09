import { RJSFSchema } from '@rjsf/utils';

type RelationTo = 'files' | 'images' | 'media'
type CompileInput<T extends RelationTo> = T extends RelationTo ? RelationTo  : never;

type UploadUiOptions = {
    "ui:options": {
        relationTo: RelationTo,
        path: string
    }
}

type NestedUploadUiOptions = { [key: string]: NestedUploadUiOptions | UploadUiOptions }

type SchemaDefinitions<T extends Refs> = {
    [key in T]: {
        "$id": `/schemas/${T}`,
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            [key: string]: any;
        }
    }
}

type SchemaDefinition<T extends Refs> = T extends Refs ? Record<T, SchemaDefinitions<T>[T]> : never

const UPLOAD_FILE_DEFINITION:SchemaDefinition<'uploadFile'> = {
    "uploadFile": {
        "$id": "/schemas/uploadFile",
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "url": {
                "type": "string"
            },
            "data": {
                "type": "object"
            }
        }
    }
}

const DEFINITION:SchemaDefinitions<Refs>  = {
    "uploadImage": {
        "$id": "/schemas/uploadImage",
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "url": {
                "type": "string"
            },
            "data": {
                "type": "object"
            }
        }
    },
    "uploadFile": {
        "$id": "/schemas/uploadFile",
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "url": {
                "type": "string"
            },
            "data": {
                "type": "object"
            }
        }
    }
}

const isEmpty = (obj:Record<string,any>) => {
    for (var i in obj) { return false; }
    return true;
}

type Refs = 'uploadFile' | 'uploadImage' 

type CompileRef<T extends string> = T extends `#/definitions/${infer R}` ? R extends Refs ? R : never : never;

type AddDefinitionFn = <T extends string>(ref: T) => SchemaDefinition<CompileRef<T>>

const addDefinitionTyped:AddDefinitionFn = (ref) => {
    if (ref === '#/definitions/uploadImage') {
        return {"uploadImage": DEFINITION['uploadImage']} as SchemaDefinition<CompileRef<'uploadImage'>>
    }
    if (ref === '#/definitions/uploadFile') {
        return {"uploadFile": DEFINITION['uploadFile']} as SchemaDefinition<CompileRef<'uploadFile'>>
    }
    throw new Error('no deff')

}

const addDefinition = (ref: string) => {
    // console.log(ref)
    if (ref === '#/definitions/uploadFile') {
        return DEFINITION['uploadFile']
    }
    return null
}

const getRefs = (schema: RJSFSchema): string[] => {
    const refs = Object.entries(schema)
        .flatMap(([key, value]): string[] => {
            if (key === '$ref') {
                return [value]
            }
            const { type, properties, items } = value
            if (type === 'object' && properties) {
                return getRefs(properties)
            }
            if (type === 'array' && items && typeof items !== 'boolean') {
                return getRefs(items)
            }
            if (typeof value === "object" && !Array.isArray(value) && value !== null) {
                return getRefs(value)
            }
            return []
        })
        .filter(Boolean)

    return refs
}

export const addDefinitions = (schema: RJSFSchema): Record<string, any> => {
    const definitions = getRefs(schema)
        .map((ref) => addDefinitionTyped(ref))
        //@ts-expect-error
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

    return definitions
}

const getUiOptions = (ref: string): UploadUiOptions | null => {

    if (ref === '#/definitions/uploadFile') {
        return {
            "ui:options": {
                relationTo: 'files',
                path: 'TEST_PATH'
            }
        }
    }
    if (ref === '#/definitions/uploadImage') {
        return {
            "ui:options": {
                relationTo: 'images',
                path: 'TEST_PATH'
            }
        }
    }
    return null
}

const isObject = (obj: unknown) => typeof obj === "object" && !Array.isArray(obj) && obj !== null

export const uiOptionsFromSchema = (schema: RJSFSchema, parent: string | null = null): NestedUploadUiOptions | null => {
    const { type, properties, items } = schema

    if (type === 'object' && properties) {
        const options = uiOptionsFromSchema(properties, parent)
        return options ? parent ? { [parent]: options } : options : null
    }
    if (type === 'array' && items && typeof items !== 'boolean') {
        const options = uiOptionsFromSchema(items, parent)
        return options ? parent ? { [parent]: { items: options } } : { items: options } : null
    }

    if (!isObject(schema)) {
        return null
    }

    let compile: Record<string, any> = {}
    // let compile: NestedUploadUiOptions = {}

    for (const key in schema) {

        if (key === "$ref") {
            const ref = schema[key]
            const options = ref ? getUiOptions(ref) : null
            if (options) {
                compile = { ...compile, ...options }
            }
            continue
        }

        const options = uiOptionsFromSchema(schema[key])
        if (options) {
            compile[key] = options
        }

    }


    return isEmpty(compile) ? null : compile

}