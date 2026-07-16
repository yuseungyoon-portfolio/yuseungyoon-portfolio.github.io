import type { ExtendedBlockTypes, NotionBlockComponent } from "../model";
import { Bookmark } from "./blocks/Bookmark";
import { BulletedListItem } from "./blocks/BulletedListItem";
import { Callout } from "./blocks/Callout";
import { Code } from "./blocks/Code";
import { Column } from "./blocks/Column";
import { ColumnList } from "./blocks/ColumnList";
import { BulletedListWrapper } from "./blocks/GroupedBulletedList";
import { NumberedListWrapper } from "./blocks/GroupedNumberedList";
import * as Headings from "./blocks/Headings";
import { NotionDivider } from "./blocks/NotionDivider";
import { NotionImg } from "./blocks/NotionImg";
import { NumberedListItem } from "./blocks/NumberedListItem";
import { Paragraph } from "./blocks/Paragraph";
import { Quote } from "./blocks/Quote";
import { Table } from "./blocks/Table";
import { Toggle } from "./blocks/Toggle";

export const blockComponentMap: Partial<{ [K in ExtendedBlockTypes]: NotionBlockComponent<K> }> = {
  bookmark: Bookmark,
  bulleted_list_item: BulletedListItem,
  grouped_bulleted_list_item: BulletedListWrapper,
  callout: Callout,
  code: Code,
  column: Column,
  column_list: ColumnList,
  divider: NotionDivider,
  heading_1: Headings.Heading_1,
  heading_2: Headings.Heading_2,
  heading_3: Headings.Heading_3,
  image: NotionImg,
  numbered_list_item: NumberedListItem,
  grouped_numbered_list_item: NumberedListWrapper,
  paragraph: Paragraph,
  quote: Quote,
  table: Table,
  toggle: Toggle,
};
