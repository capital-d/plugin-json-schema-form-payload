import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import type { CollectionConfig } from 'payload/types'

export const Images: CollectionConfig = {
    slug: 'images',
    upload: {
        staticDir: path.resolve(__dirname, '../../../static/images'),
        staticURL: "/static",
        crop: true,
        focalPoint: true,
        formatOptions: {
            format: "webp",
            options: {
                quality: 85,
            },
        },
        imageSizes: [
            {
                name: "blur",
                width: 32,
                formatOptions: {
                    format: "png",
                },
            },
            {
                name: "thumbnail",
                width: 400,
                formatOptions: {
                    format: "webp",
                },
            },
            {
                name: 'card',
                width: 768,
                position: 'centre',
                formatOptions: {
                    format: "webp",
                },
            },
            {
                name: 'tablet',
                width: 1024,
                formatOptions: {
                    format: "webp",
                },
            },
            {
                name: "landscape",
                width: 1440,
                formatOptions: {
                    format: "webp",
                },
            },
        ],
        adminThumbnail: "thumbnail",
        mimeTypes: ["image/*"],
        
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        },
        {
            name: 'caption',
            type: 'richText',
            editor: slateEditor({
                admin: {
                    elements: ['link'],
                },
            }),
        },
    ],
}
