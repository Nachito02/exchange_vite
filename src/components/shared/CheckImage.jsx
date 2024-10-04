import React from 'react'

import styled from "styled-components";
import { CheckCircle } from "@styled-icons/material";

import { useAppContext } from '../../context'


export default function CheckImage() {
    const [state] = useAppContext();
    return (
        <CheckImageContainer>
            <Image src={state.image} />
            <CheckIcon></CheckIcon>
        </CheckImageContainer>
    )
}

const CheckIcon = styled(CheckCircle)`
    color: springgreen;
    height: 60px;
    width: 60px;
    padding: 0 8px;
    position: absolute;
    bottom: 50px;
    left: calc(50% + 16px);
`

const CheckImageContainer = styled.div`
    position: relative;
    width: 100%;
    padding: 0px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
`

const Image = styled.img`
    max-width: 50%;
    height: auto;
    max-height: calc(100vh - 250px);
    padding: 0px;
    box-sizing: border-box;
`