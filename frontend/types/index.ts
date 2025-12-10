// Copyright 2025 vitech
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  CarouselSchema,
  CartSchema,
  DeliveryDateSchema,
  OrderInputSchema,
  OrderItemSchema,
  PaymentMethodSchema,
  ProductInputSchema,
  ReviewInputSchema,
  SettingInputSchema,
  ShippingAddressSchema,
  SiteLanguageSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
  WebPageInputSchema,
} from "@/lib/validator";
import z from "zod";

export type IReviewInput = z.infer<typeof ReviewInputSchema>;
export type IReviewDetails = IReviewInput & {
  _id: string;
  createdAt: string;
  user: {
    name: string;
  };
};

export type IProductInput = z.infer<typeof ProductInputSchema>;

export type Data = {
  settings: ISettingInput[];
  products: IProductInput[];
  webPage: IWebPageInput[];
  users: IUserInput[];
  reviews: {
    title: string;
    comment: string;
    rating: number;
  }[];

  headerMenus: {
    name: string;
    href: string;
  }[];

  carousels: {
    image: string;
    url: string;
    title: string;
    buttonCaption: string;
    isPublished: boolean;
  }[];
};

// Order types
export type IOrderInput = z.infer<typeof OrderInputSchema>;
export type IOrderList = IOrderInput & {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
};
export type IOrderItem = z.infer<typeof OrderItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

// User types
export type IUserInput = z.infer<typeof UserInputSchema>;
export type IUserSignIn = z.infer<typeof UserSignInSchema>;
export type IUserSignUp = z.infer<typeof UserSignUpSchema>;
export type UserName = z.infer<typeof UserNameSchema>;

// web page types
export type IWebPageInput = z.infer<typeof WebPageInputSchema>;

// Setting types
export type ICarousel = z.infer<typeof CarouselSchema>;
export type ISettingInput = z.infer<typeof SettingInputSchema>;
export type ClientSetting = ISettingInput & {
  currency: string;
};

export type SiteLanguage = z.infer<typeof SiteLanguageSchema>;
export type SiteCurrency = z.infer<typeof SettingInputSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryDate = z.infer<typeof DeliveryDateSchema>;
