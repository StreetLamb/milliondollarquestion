import React from "react";
import styled from "styled-components";
import { Row, Container, Button } from "react-bootstrap";
import RecommendedCard from "../components/RecommendedCard";
import SimiliarRecipeCard from "./SimiliarRecipeCard";

const OptionSelectionWrapper = styled.div`
  text-align: center;
  width: 100%;
`;

const SButton = styled(Button)`
  margin: 5px;
`;

const Header = styled.h3`
  font-weight: 700;
  text-align: center;
`;

const SubHeader = styled.p`
  text-align: center;
`;

const StyledSRecipeBox = styled.div`
  display: flex;
  margin: auto;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const MDAnswer = ({
  recipe,
  isSavedRecipe,
  onEdit,
  onSave,
  onUnsave,
  onAnother,
  allRecipes,
  changeCard,
  fetchMoreData,
  hasMore,
}) => {
  const SimiliarRecipes = allRecipes
    ? allRecipes
        .filter((r) => r.id !== recipe.id)
        .map((r) => (
          <SimiliarRecipeCard key={r.id} recipe={r} changeCard={changeCard} />
        ))
    : null;

  return (
    <Container
      style={{ margin: "auto", marginTop: "2rem", marginBottom: "2rem" }}
    >
      <div>
        <Header>The Million Dollar Answer</Header>
        <SubHeader>This is what we suggest: </SubHeader>
      </div>
      <RecommendedCard
        recipe={recipe}
        isSavedRecipe={isSavedRecipe}
        onSave={onSave}
        onUnsave={onUnsave}
      />
      <Row>
        <OptionSelectionWrapper>
          <SButton variant="outline-primary" onClick={onEdit}>
            Edit
          </SButton>
          <SButton variant="outline-primary" onClick={onAnother}>
            Another
          </SButton>
        </OptionSelectionWrapper>
      </Row>
      {SimiliarRecipes.length > 0 ? (
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4>Based on your preferences, you might also like...</h4>
          {/* <p>infinite scroll</p> */}
          {/* <InfiniteScroll
            dataLength={allRecipes.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<span>Loading...</span>}
            endMessage={<span>No more recipes :(</span>}
          >
            <StyledSRecipeBox>{SimiliarRecipes}</StyledSRecipeBox>
          </InfiniteScroll> */}
          <StyledSRecipeBox>{SimiliarRecipes}</StyledSRecipeBox>
        </div>
      ) : null}
    </Container>
  );
};

export default MDAnswer;
