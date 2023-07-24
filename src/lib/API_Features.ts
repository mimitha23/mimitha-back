class API_Features {
  doc;
  query;
  agregationQuery: any[] = [];

  constructor(doc?: any, query?: any) {
    this.doc = doc;
    this.query = query;
  }

  ///////////////////////
  // for 'find' query //
  //////////////////////
  selectFields({ isProduct = false }: { isProduct?: boolean }) {
    const fieldsToSelect = this.generateSelectFieldsObjects({
      isProduct,
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

  async execute(): Promise<any[]> {
    try {
      return await this.doc;
    } catch (error) {
      throw error;
    }
  }

  filter() {
    const simpleKeys = ["createdAt"];

    const queryKeys = Object.keys(this.query);

    let queryToModify: any = {};

    queryKeys
      .filter((key) => simpleKeys.includes(key))
      .map((key) => (queryToModify[key] = this.query[key]));

    // filter by isPublic
    if (this.query.isPublic)
      queryToModify.isPublic = this.query.isPublic === "1" ? true : false;

    const finalQuery = JSON.parse(
      JSON.stringify(queryToModify).replace(
        /gt|gte|lt|lte|regex/g,
        (match) => `$${match}`
      )
    );

    this.doc = this.doc.find(finalQuery);

    return this;
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
      $project: this.generateSelectFieldsObjects({
        isProduct: true,
        asString: false,
        select,
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
    const filterableKeys = ["isPublic", "category", "productType", "title"];

    if (!Object.keys(query).some((key) => filterableKeys.includes(key))) return;

    const queryToExecute: any = {};

    if (query.isPublic) {
      queryToExecute.isPublic = query.isPublic === "1" ? true : false;
    }

    if (query.category) {
      queryToExecute["product.category.query"] = query.category;
    }

    if (query.productType) {
      queryToExecute["product.productType.query"] = query.productType;
    }

    if (query.styles) {
      queryToExecute["product.styles.query"] = query.styles;
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

    this.agregationQuery.push({
      $match: queryToExecute,
    });
  }

  generateAgregationQuery(query: any) {
    const { page, limit, sort, select }: any = query;

    this.filterAgregation(query);
    sort && this.sortAgregation(sort);
    select && this.selectAgregationField(select);
    page && limit && this.paginateAgregation(page, limit);

    return this.agregationQuery;
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

  generateSelectFieldsObjects({
    select,
    asString = true,
    isProduct,
  }: {
    select: any;
    asString?: boolean;
    isProduct: boolean;
  }) {
    const selectTemp = select
      ?.split(",")
      ?.map((fragment: string) => fragment.trim())
      ?.join(" ");

    let fieldsToSelectStr = "";
    const fieldsToSelectObj: any = {};

    const full = "-__v";
    const short = "title price color inStock assets rating soldOut";

    if (isProduct && (select === "full" || select === "short")) {
      if (asString) {
        if (select === "short" || !select) fieldsToSelectStr = short;
        else if (select === "full") fieldsToSelectStr = full;
      } else {
        if (select === "short")
          short.split(" ").forEach((key) => (fieldsToSelectObj[key] = 1));
        else if (select === "full")
          full.split(" ").forEach((key) => (fieldsToSelectObj[key] = -1));
      }
    } else {
      if (asString) fieldsToSelectStr = selectTemp as string;
      else
        selectTemp.split(" ").forEach((key: string) => {
          const configuredKey = key.replace("-", "");

          const registeredProductKeys = [
            "category",
            "productType",
            "seasons",
            "textures",
            "styles",
          ];
          const isRegisteredProductKey =
            registeredProductKeys.includes(configuredKey);

          fieldsToSelectObj[
            isRegisteredProductKey ? `product.${configuredKey}` : configuredKey
          ] = key.startsWith("-") ? -1 : 1;
        });
    }

    return asString ? fieldsToSelectStr : fieldsToSelectObj;
  }
}

export default API_Features;
