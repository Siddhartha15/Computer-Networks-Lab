
sudo ip netns add ns
sudo ip netns add ns1

sudo ip link add eth0 type veth peer name eth1

sudo ip link set eth0 netns ns
sudo ip link set eth1 netns ns1

sudo ip netns exec ns ip link set eth0 up
sudo ip netns exec ns1 ip link set eth1 up

sudo ip netns exec ns ip address add 10.0.0.1/24 dev eth0
sudo ip netns exec ns1 ip address add 10.0.0.2/24 dev eth1

sudo ip netns exec ns ping 10.0.0.2

sudo ip netns delete ns
sudo ip netns delete ns1

# sudo ip link delete eth1
# sudo ip link delete eth0
