import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Grid, Loader } from "semantic-ui-react";

import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

function ActivityDashboard() {
  const {
    activityStore: {
      loadActivities,
      loadingInitial,
      activitiesRegistry,
      setPagingParams,
      pagination,
    },
  } = useStore();
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = async () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    await loadActivities(false);
    setLoadingNext(false);
  };

  useEffect(() => {
    if (activitiesRegistry.size <= 1) loadActivities();
  }, [activitiesRegistry.size, loadActivities]);

  return (
    <Grid>
      <Grid.Column width="10">
        {loadingInitial && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={
              !loadingNext &&
              !!pagination &&
              pagination.currentPage < pagination.totalPages
            }
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDashboard);
