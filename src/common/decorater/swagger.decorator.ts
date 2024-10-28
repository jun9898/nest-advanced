import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResDto } from '../dto/res.dto';

export const ApiGetResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    // 200 response
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }]
      }
    })
  )
}

export const ApiPostResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    // 201 response
    ApiCreatedResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }]
      }
    })
  )
}

export const ApiGetItemsResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    // 200 response
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageResDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) }
                // 중괄호 레전드네 진짜
              },
            },
            required: ['items']
          }
        ]
      }
    })
  )
}