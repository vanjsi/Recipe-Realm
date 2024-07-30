// src/types.ts
export interface Author {
    id: number;
    name: string;
  }
  
  export interface Recipe {
    id: number;
    title: string;
    description: string;
    ingredients?: string[]; 
    steps?: string[]; 
    author: Author;
    isAuthor?: boolean; 
    date?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  