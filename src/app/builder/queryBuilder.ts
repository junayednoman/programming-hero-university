import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    if (this.query.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const filterQueryObj = { ...this.query };
    // filter query
    const excludeFields = ['searchTerm', 'sort', 'limit', 'pages', 'fields'];
    excludeFields.forEach((field) => {
      delete filterQueryObj[field];
    });

    this.modelQuery = this.modelQuery.find(filterQueryObj as FilterQuery<T>);
  }
}
