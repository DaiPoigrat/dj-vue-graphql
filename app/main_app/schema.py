from django.conf import settings
from graphene_django import DjangoObjectType
import graphene

from .models import Market, WishList


class MarketType(DjangoObjectType):
    class Meta:
        model = Market
        fields = ('id', 'name')


class CreateMarket(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    market = graphene.Field(MarketType)

    def mutate(root, info, name):
        try:
            market = Market(name=name)
            market.save()

            return CreateMarket(market=market)
        except Exception as e:
            print(f"Create Market {e=}")
            return None


class DeleteMarket(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    market = graphene.Field(MarketType)
    ok = graphene.Boolean()

    def mutate(root, info, name):
        try:
            market = Market.objects.get(name=name)
            market.delete()

            return DeleteMarket(ok=True)
        except Exception as e:
            print(f"Delete Market {e=}")
            return None


class EditMarket(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        new_name = graphene.String()

    market = graphene.Field(MarketType)
    ok = graphene.Boolean()

    def mutate(root, info, name, new_name):
        try:
            market = Market.objects.get(name=name)
            market.name = new_name
            market.save()

            return EditMarket(ok=True, market=market)
        except Exception as e:
            print(f"Edit Market {e=}")
            return None


class WishListType(DjangoObjectType):
    class Meta:
        model = WishList
        fields = ('id', 'market', 'name')


class CreateWish(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        name = graphene.String()
        market_name = graphene.String()

    wish = graphene.Field(WishListType)

    # можно искать по fk
    def mutate(root, info, name, market_name):
        try:
            print(market_name)
            market = Market.objects.get(name=market_name)
            print(isinstance(market, Market))
            wish = WishList(name=name, market=market)
            wish.save()

            return CreateWish(wish=wish)
        except Exception as e:
            print(f"Create Wish {e=}")
            return None


class DeleteWish(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    wish = graphene.Field(WishListType)
    ok = graphene.Boolean()

    # можно искать по pk(id)
    def mutate(root, info, id):
        try:
            wish = WishList.objects.get(pk=id)
            wish.delete()

            return DeleteWish(ok=True)
        except Exception as e:
            print(f"Delete Wish {e=}")
            return None


class EditWish(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        new_name = graphene.String()

    wish = graphene.Field(WishListType)
    ok = graphene.Boolean()

    def mutate(root, info, id, new_name):
        try:
            wish = WishList.objects.get(pk=id)
            wish.name = new_name
            wish.save()

            return EditWish(ok=True, wish=wish)
        except Exception as e:
            print(f"Edit Wish {e=}")
            return None


class Query(graphene.ObjectType):
    market_list = graphene.List(MarketType)
    market_by_name = graphene.Field(MarketType, name=graphene.String(required=False))

    wish_list = graphene.List(WishListType)
    wish_list_by_market_name = graphene.List(WishListType, market_name=graphene.String(required=False))

    def resolve_market_list(root, info):
        return Market.objects.all()

    def resolve_market_by_name(root, info, name=None):
        try:
            return Market.objects.get(name=name)
        except:
            return None

    def resolve_wish_list(root, info):
        return WishList.objects.all()

    def resolve_wish_list_by_market_name(root, info, market_name=None):
        try:
            return WishList.objects.filter(market=market_name)
        except:
            return None


class Mutations(graphene.ObjectType):
    create_market = CreateMarket.Field()
    delete_market = DeleteMarket.Field()
    edit_market = EditMarket.Field()

    create_wish = CreateWish.Field()
    delete_wish = DeleteWish.Field()
    edit_wish = EditWish.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
