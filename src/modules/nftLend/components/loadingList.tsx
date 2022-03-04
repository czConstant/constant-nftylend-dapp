import { memo } from "react";
import ContentLoader from "react-content-loader";

interface LoadingListProps {
  num_items?: number;
}

const LoadingList: React.FC<LoadingListProps> = ({ num_items }) =>
  Array(num_items)
    .fill(0)
    .map((item, index) => (
      <ContentLoader
        key={index}
        speed={1}
        backgroundColor="#343a40"
        foregroundColor="#6c757d"
        height={300}
      >
        <rect x="0" y="0" rx="0" ry="0" width="100%" height="200" />
        <rect x="0" y="215" rx="0" ry="0" width="50%" height="15" />
        <rect x="0" y="233" rx="0" ry="0" width="90%" height="10" />
      </ContentLoader>
    ));

LoadingList.defaultProps = {
  num_items: 1,
};

export default memo(LoadingList);
