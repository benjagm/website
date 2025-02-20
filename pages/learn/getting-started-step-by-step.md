---
title: Creating a schema
section: docs
---

* [Introduction](#intro)
* [Starting the schema](#starting)
* [Defining the properties](#properties)
* [Going deeper with properties](#properties-deeper)
* [Nesting data structures](#nesting)
* [References outside the schema](#references)
* [Taking a look at data for our defined JSON Schema](#data)

<span id="intro"></span>

## Introduction[#intro]

The following example is by no means definitive of all the value JSON Schema can provide. For this you will need to go deep into the specification itself -- learn more at [https://json-schema.org/specification](/specification).

Let's pretend we're interacting with a JSON based product catalog. This catalog has a product which has:

* An identifier: `productId`
* A product name: `productName`
* A selling cost for the consumer: `price`
* An optional set of tags: `tags`.

For example:

```json
{
  "productId": 1,
  "productName": "A green door",
  "price": 12.50,
  "tags": [ "home", "green" ]
}
```

While generally straightforward, the example leaves some open questions. Here are just a few of them:

* What is `productId`?
* Is `productName` required?
* Can the `price` be zero (0)?
* Are all of the `tags` string values?

When you're talking about a data format, you want to have metadata about what keys mean, including the valid inputs for those keys. **JSON Schema** is a proposed IETF standard how to answer those questions for data.

## Starting the schema[#starting]

To start a schema definition, let's begin with a basic JSON schema.

We start with four properties called **keywords** which are expressed as [JSON](https://www.json.org/) keys.

> Yes. the standard uses a JSON data document to describe data documents, most often that are also JSON data documents but could be in any number of other content types like `text/xml`.

* The [`$schema`](https://json-schema.org/draft/2020-12/json-schema-core.html#section.8.1.1) keyword states that this schema is written according to a specific draft of the standard and used for a variety of reasons, primarily version control.
* The [`$id`](https://json-schema.org/draft/2020-12/json-schema-core.html#section.8.2.1) keyword defines a URI for the schema, and the base URI that other URI references within the schema are resolved against.
* The [`title`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.9.1) and [`description`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.9.1) annotation keywords are descriptive only. They do not add constraints to the data being validated. The intent of the schema is stated with these two keywords.
* The [`type`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.1.1) validation keyword defines the first constraint on our JSON data and in this case it has to be a JSON Object.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product in the catalog",
  "type": "object"
}
```

We introduce the following pieces of terminology when we start the schema:

* [Schema Keyword](https://json-schema.org/draft/2020-12/json-schema-core.html#section.8.1.1): `$schema` and `$id`.
* [Schema Annotations](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.9.1): `title` and `description`.
* [Validation Keyword](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.1.1): `type`.

<span id="properties"></span>

## Defining the properties[#properties]

`productId` is a numeric value that uniquely identifies a product. Since this is the canonical identifier for a product, it doesn't make sense to have a product without one, so it is required.

In JSON Schema terms, we update our schema to add:

* The [`properties`](https://json-schema.org/draft/2020-12/json-schema-core.html#section.10.3.2.1) validation keyword.
* The `productId` key.
  * `description` schema annotation and `type` validation keyword is noted -- we covered both of these in the previous section.
* The [`required`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.5.3) validation keyword listing `productId`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    }
  },
  "required": [ "productId" ]
}
```

* `productName` is a string value that describes a product. Since there isn't much to a product without a name it also is required.
* Since the `required` validation keyword is an array of strings we can note multiple keys as required; We now include `productName`.
* There isn't really any difference between `productId` and `productName` -- we include both for completeness since computers typically pay attention to identifiers and humans typically pay attention to names.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    }
  },
  "required": [ "productId", "productName" ]
}
```

## Going deeper with properties[#properties-deeper]

According to the store owner there are no free products. ;)

* The `price` key is added with the usual `description` schema annotation and `type` validation keywords covered previously. It is also included in the array of keys defined by the `required` validation keyword.
* We specify the value of `price` must be something other than zero using the [`exclusiveMinimum`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.2.5) validation keyword.
  * If we wanted to include zero as a valid price we would have specified the [`minimum`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.2.4) validation keyword.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

Next, we come to the `tags` key.

The store owner has said this:

* If there are tags there must be at least one tag,
* All tags must be unique; no duplication within a single product.
* All tags must be text.
* Tags are nice but they aren't required to be present.

Therefore:

* The `tags` key is added with the usual annotations and keywords.
* This time the `type` validation keyword is `array`.
* We introduce the [`items`](https://json-schema.org/draft/2020-12/json-schema-core.html#section.10.3.1.2) validation keyword so we can define what appears in the array. In this case: `string` values via the `type` validation keyword.
* The [`minItems`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.4.2) validation keyword is used to make sure there is at least one item in the array.
* The [`uniqueItems`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.4.3) validation keyword notes all of the items in the array must be unique relative to one another.
* We did not add this key to the `required` validation keyword array because it is optional.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

<span id="nesting"></span>

## Nesting data structures[#nesting]

Up until this point we've been dealing with a very flat schema -- only one level. This section demonstrates nested data structures.

* The `dimensions` key is added using the concepts we've previously discovered. Since the `type` validation keyword is `object` we can use the `properties` validation keyword to define a nested data structure.
  * We omitted the `description` annotation keyword for brevity in the example. While it's usually preferable to annotate thoroughly in this case the structure and key names are fairly familiar to most developers.
* You will note the scope of the `required` validation keyword is applicable to the dimensions key and not beyond.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "dimensions": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": [ "length", "width", "height" ]
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

## References outside the schema[#references]

So far our JSON schema has been wholly self contained. It is very common to share JSON schema across many data structures for reuse, readability and maintainability among other reasons.

For this example we introduce a new JSON Schema resource and for both properties therein:
* We use the `minimum` validation keyword noted earlier.
* We add the [`maximum`](https://json-schema.org/draft/2020-12/json-schema-validation.html#section.6.2.2) validation keyword.
* Combined, these give us a range to use in validation.

```json
{
  "$id": "https://example.com/geographical-location.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Longitude and Latitude",
  "description": "A geographical coordinate on a planet (most commonly Earth).",
  "required": [ "latitude", "longitude" ],
  "type": "object",
  "properties": {
    "latitude": {
      "type": "number",
      "minimum": -90,
      "maximum": 90
    },
    "longitude": {
      "type": "number",
      "minimum": -180,
      "maximum": 180
    }
  }
}
```

Next we add a reference to this new schema so it can be incorporated.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "dimensions": {
      "type": "object",
      "properties": {
        "length": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      },
      "required": [ "length", "width", "height" ]
    },
    "warehouseLocation": {
      "description": "Coordinates of the warehouse where the product is located.",
      "$ref": "https://example.com/geographical-location.schema.json"
    }
  },
  "required": [ "productId", "productName", "price" ]
}
```

## Taking a look at data for our defined JSON Schema[#data]

We've certainly expanded on the concept of a product since our earliest sample data (scroll up to the top). Let's take a look at data which matches the JSON Schema we have defined.

```json

  {
    "productId": 1,
    "productName": "An ice sculpture",
    "price": 12.50,
    "tags": [ "cold", "ice" ],
    "dimensions": {
      "length": 7.0,
      "width": 12.0,
      "height": 9.5
    },
    "warehouseLocation": {
      "latitude": -78.75,
      "longitude": 20.4
    }
  }
```
