from vehicles.models import Vehicles
from swappingstations.models import SwappingStations
from subscriptionplans.models import Subscription
from accounts.models import User,UserVehicle,UserVehicleSubscription



def ezyev_data():
    user=User.objects.create_user(username='USR1',phone="1234567899", password='1234', full_name="tabish", email="usr1@gmail.com", is_active=True ,is_admin=True)
    # user.create_superuser()
    user.is_admin=True
    user.save()


    vehicle = Vehicles(
        name="EZY EV Pro",
        short_description=" EZY EV Pro EZY EV Pro EZY EV Pro EZY EV Pro EZY EV Pro",
        battery_capacity="36 Ah",
        vehicle_range="100 km ",
        top_speed="100 kmph",
        long_description=" EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro ",
        image="",
        is_available="True",
    )
    vehicle.save()

    swapping_station = SwappingStations(
        name="kondhwa Swap station ",
        address=" kondhwa ",
        map_link="https://maps.app.goo.gl/NpTXpHptLysDeFDo7",
        latitude=18.47938646666948,
        longitude=73.89630945265489,
    )
    swapping_station.save()

    subscription=Subscription(
        price="2000",
        is_active="True",
        description_points="Best monthly plan  Best monthly plan  Best monthly plan  Best monthly plan  Best monthly plan ",
        vehicle=vehicle,
        no_of_swaps="100",
    )
    subscription.save()


def ezyev_data_new():
    user=User.objects.create_user(username='USR1',phone="1234567899", password='1234', full_name="tabish", email="usr1@gmail.com", is_active=True ,is_admin=True)
    # user.create_superuser()
    user.is_admin=True
    user.save()


    vehicle = Vehicles(
        name="EZY EV Pro",
        short_description=" EZY EV Pro EZY EV Pro EZY EV Pro EZY EV Pro EZY EV Pro",
        battery_capacity="36 Ah",
        vehicle_range="100 km ",
        top_speed="100 kmph",
        long_description=" EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro  EZY EV Pro ",
        image="",
        is_available="True",
    )
    vehicle.save()

    swapping_station = SwappingStations(
        name="kondhwa Swap station ",
        address=" kondhwa ",
        map_link="https://maps.app.goo.gl/NpTXpHptLysDeFDo7",
        latitude=18.47938646666948,
        longitude=73.89630945265489,
    )
    swapping_station.save()

    subscription=Subscription(
        price="2000",
        is_active="True",
        description_points="Best monthly plan  Best monthly plan  Best monthly plan  Best monthly plan  Best monthly plan ",
        vehicle=vehicle,
        no_of_swaps="100",
    )
    subscription.save()
    
    user_vehicle =UserVehicle(
        user=user,
        vehicle=vehicle,
        registration_number="MH28AK0047"
    )
    user_vehicle.save()

    user_vehicle_subscription=UserVehicleSubscription(
        user_vehicle=vehicle,
        total_swaps=30,
        available_swaps=30,
        last_swaps_done='',
        subscription=subscription,
        is_active = True
    )
    user_vehicle_subscription.save()