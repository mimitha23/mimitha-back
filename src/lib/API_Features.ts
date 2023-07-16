class API_Features {
  doc;
  query;

  constructor(doc: any, query: any) {
    this.doc = doc;
    this.query = query;
  }

  selectFields({ isProduct = false }: { isProduct?: boolean }) {
    const select = this.query.select
      ?.split(",")
      ?.map((fragment: string) => fragment.trim())
      ?.join(" ");

    let fieldsToSelect = "";

    if (isProduct) {
      const full = "-__v";
      const short = "title price color inStock assets rating soldOut";

      if (select === "short" || !select) fieldsToSelect = short;
      else if (select === "full") fieldsToSelect = full;
      else fieldsToSelect = select as string;
    } else fieldsToSelect = select as string;

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
    function generateMultipleFieldSortObject(query: any) {
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

    if (this.query.sort) {
      const sortBy = generateMultipleFieldSortObject(this.query);
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
}

export default API_Features;
