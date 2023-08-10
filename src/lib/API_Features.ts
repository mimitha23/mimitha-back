class API_Features {
  doc;
  query;
  agregationQuery: any[] = [];
  docType;

  constructor({
    doc,
    query,
    docType = "PRODUCT",
  }: {
    doc?: any;
    query: any;
    docType?: "PRODUCT";
  }) {
    this.doc = doc;
    this.query = query;
    this.docType = docType;
  }

  ///////////////////////
  // for 'find' query //
  //////////////////////
  selectFields() {
    const fieldsToSelect = this.generateSelectFields({
      asString: true,
      select: this.query.select,
    });

    this.doc = this.doc.select(fieldsToSelect);

    return this;
  }

  pagination() {
    if (!this.query.page) return this;

    const limit = this.query.limit || 10;
    const page = this.query.page;

    const skip = (page - 1) * limit;

    this.doc = this.doc.skip(skip).limit(limit);

    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.generateMultipleFieldSortObject(this.query);
      this.doc = this.doc.sort(sortBy);
    } else this.doc = this.doc.sort("-createdAt");

    return this;
  }

  countDoc(data: any[]): { count: number; isRequested: boolean } {
    if (this.query.hasMore && JSON.parse(this.query.hasMore))
      return { count: data.length, isRequested: true };
    else return { count: NaN, isRequested: true };
  }

  filter() {
    const queryToExecute: any = {};

    if (this.docType === "PRODUCT")
      this.filterProduct({ query: this.query, queryToExecute });

    const finalQuery = JSON.parse(
      JSON.stringify(queryToExecute).replace(
        /gt|gte|lt|lte|regex/g,
        (match) => `$${match}`
      )
    );

    this.doc = this.doc.find(finalQuery);

    return this;
  }

  async execute(): Promise<any> {
    try {
      await this.doc;
      return this;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////
  // for agregationQuery //
  /////////////////////////
  sortAgregation(sort: any) {
    this.agregationQuery.push({
      $sort: this.generateMultipleFieldSortObject({ sort }),
    });
  }

  selectAgregationField(select: any) {
    this.agregationQuery.push({
      $project: this.generateSelectFields({
        select,
        asString: false,
      }),
    });
  }

  paginateAgregation(page: any, limit: any) {
    this.agregationQuery.push(
      ...[
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: +limit,
        },
      ]
    );
  }

  filterAgregation(query: any) {
    const queryToExecute: any = {};

    if (this.docType === "PRODUCT")
      this.filterProduct({ query, queryToExecute });

    this.agregationQuery.push({
      $match: queryToExecute,
    });
  }

  generateAgregationQuery() {
    const { page, limit, sort, select }: any = this.query;

    this.filterAgregation(this.query);
    sort && this.sortAgregation(sort);
    select && this.selectAgregationField(select);
    page && limit && this.paginateAgregation(page, limit);

    return this.agregationQuery;
  }

  // PRODUCT
  filterProduct({
    query,
    queryToExecute,
  }: {
    query: any;
    queryToExecute: any;
  }) {
    const filterableKeys = [
      "isPublic",
      "category",
      "productType",
      "styles",
      "seasons",
      "title",
      "textures",
      "gender",
      "sale",
    ];

    if (!Object.keys(query).some((key) => filterableKeys.includes(key))) return;

    if (query.isPublic) {
      queryToExecute.isPublic = query.isPublic === "1" ? true : false;
    }

    if (query.sale) {
      queryToExecute["sale"] = true;
    }

    if (query.gender) {
      queryToExecute["product.gender.query"] = {
        $in: query.gender.split(","),
      };
    }

    if (query.category) {
      queryToExecute["product.category.query"] = query.category;
    }

    if (query.productType) {
      queryToExecute["product.productType.query"] = {
        $in: query.productType.split(","),
      };
    }

    if (query.styles) {
      queryToExecute["product.styles.query"] = {
        $in: query.styles?.split(","),
      };
    }

    if (query.seasons) {
      queryToExecute["product.seasons.query"] = {
        $in: query.seasons?.split(","),
      };
    }

    if (query.title) {
      queryToExecute.$or = [
        ...(queryToExecute.$or || []),
        {
          "title.ka": { $regex: query.title, $options: "i" },
        },
        {
          "title.en": { $regex: query.title, $options: "i" },
        },
      ];
    }

    if (query.textures) {
      queryToExecute.$or = [
        ...(queryToExecute.$or || []),
        {
          "product.textures.ka": {
            $in: query.textures?.split(","),
          },
        },
        {
          "product.textures.en": {
            $in: query.textures?.split(","),
          },
        },
      ];
    }
  }

  selectProductFields({
    asString,
    select,
  }: {
    asString: boolean;
    select: any;
  }) {
    let fieldsToSelectStr = "";
    const fieldsToSelectObj: any = {};

    const short = "title price color inStock assets rating soldOut";

    const registeredProductKeys = [
      "category",
      "productType",
      "seasons",
      "textures",
      "styles",
      "isEditable",
      "_id",
    ];

    select &&
      select.split(" ").forEach((key: string) => {
        const configuredKey = key.replace("-", "");

        const isRegisteredProductKey =
          registeredProductKeys.includes(configuredKey);

        if (asString) {
          if (select === "short" || !select) fieldsToSelectStr = short;
          else
            fieldsToSelectStr += isRegisteredProductKey
              ? `${key.startsWith("-") ? "-" : ""}product.${configuredKey} `
              : `${key} `;
        } else {
          if (select === "short" || !select)
            short.split(" ").forEach((key) => (fieldsToSelectObj[key] = 1));
          else
            fieldsToSelectObj[
              isRegisteredProductKey
                ? `product.${configuredKey}`
                : configuredKey
            ] = key.startsWith("-") ? -1 : 1;
        }
      });

    return asString ? fieldsToSelectStr : fieldsToSelectObj;
  }

  // helpers
  generateMultipleFieldSortObject(query?: any) {
    if (!query.sort) return { createdAt: -1 };

    const sort = query.sort
      ?.split(",")
      ?.map((fragment: string) => fragment.trim());

    const sortObject: any = {};

    sort.forEach((fragment: string) => {
      const key = fragment.replace("-", "");
      sortObject[key] = fragment.startsWith("-") ? -1 : 1;
    });

    return sortObject;
  }

  generateSelectFields({
    select,
    asString = true,
  }: {
    select: any;
    asString?: boolean;
  }) {
    const selectTemp = select
      ?.split(",")
      ?.map((fragment: string) => fragment.trim())
      ?.join(" ");

    let query;

    if (this.docType === "PRODUCT") {
      query = this.selectProductFields({
        asString,
        select: selectTemp,
      });
    }

    return query;
  }
}

export default API_Features;
