import { toSQLArray } from "../utils/serializer";

export const similar = (
  sourceId: string,
  contentId: string,
  tagIds: string[],
  offset: number
) =>
  `
SELECT
   cts.*,
   agg.pct
FROM
   (
      SELECT
         CT."contentId",
         CAST(COUNT(*) AS FLOAT) / CAST(${tagIds.length} AS FLOAT) AS pct 
      FROM
         "ContentTag" CT 
         JOIN
            contents c 
            ON c."sourceId" = CT."sourceId" 
            AND c."contentId" = CT."contentId" 
      WHERE
         CT."sourceId" = '${sourceId}'
         AND CT."contentId" != '${contentId}'
         AND "tagId" IN ${toSQLArray(tagIds)}
         
      GROUP BY
         CT."contentId" 
   ) agg 
JOIN
   contents cts 
   ON cts."sourceId" = '${sourceId}' 
   AND agg."contentId" = cts."contentId" 
WHERE
   agg.pct >= 0.75 
ORDER BY
   agg.pct DESC,
   popularity DESC
OFFSET ${offset}
LIMIT 30
  `.trim();
