
sudo ip netns add ak

sudo ip link add eth0 type veth peer name eth1

sudo ip link set eth0 netns ak

# sudo ip netns exec ak ip link set lo up

sudo ip netns exec ak ip link set eth0 up
sudo ip link set eth1 up

sudo ip netns exec ak ip address add 10.0.0.1/24 dev eth0
sudo ip address add 10.0.0.2/24 dev eth1

sudo ping 10.0.0.1

sudo ip netns delete ak

sudo ip link delete eth1
