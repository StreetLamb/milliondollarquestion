import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Button } from "react-bootstrap";
import Recipe from "./Recipe";

const SCard = styled(Card)`
  max-width: 600px;
  margin: auto;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const SCardTitle = styled.h4`
  font-weight: 700;
  padding-top: 0.5rem;
`;

// const SCardText = styled.div`
//   padding: 20px;
// `;

// const NavArea = styled.div`
//   padding: 20px;
// `;

// const Image = styled.img`
//   width: 100%;
//   height: 700px;
//   background: ${(props) =>
//     props.recipe &&
//     `url(${JSON.stringify(props.recipe.image)})
//     no-repeat center`};
//   background-size: cover;
//   padding: -15px;
// `;

// const ImgCol = styled(Col)`
//   padding-right: 0px;
// `;

const Link = styled.a`
  text-decoration: underline;
  color: black;
`;

const StyledCardImg = styled(Card.Img)`
  width: 100%;
  height: 20rem;
  object-fit: cover;
  background: no-repeat center;
`;

const StyledCardBody = styled(Card.Body)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RecommendedCard = ({ recipe }) => {
  return (
    <SCard>
      <StyledCardImg variant="top" src={recipe.image} />
      <StyledCardBody>
        <SCardTitle>{recipe.title}</SCardTitle>
        <Link href="www.kitchen.com/recipe" target="_blank">
          www.kitchen.com
        </Link>
        <Recipe
          key={recipe.id}
          id={recipe.id}
          recipeIngredients={recipe.extendedIngredients}
          recipeMethod={recipe.analyzedInstructions}
        />
        <Button variant="primary" href={recipe.sourceUrl} target="_blank">
          Go to site
        </Button>
      </StyledCardBody>
    </SCard>
  );
};

export default RecommendedCard;
